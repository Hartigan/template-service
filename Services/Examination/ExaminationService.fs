namespace Services.Examination

open Contexts
open DatabaseTypes
open Models.Identificators
open Models.Reports
open Models.Problems
open Services.Problems
open Services.Permissions
open System
open Utils.ResultHelper
open Models.Permissions
open FSharp.Control
open Services.VersionControl
open Models.Heads

type ExaminationService(reportContext: IContext<Report>,
                        submissionContext: IContext<Submission>,
                        versionControlService: IVersionControlService,
                        problemsService: IProblemsService,
                        permissionsService: IPermissionsService,
                        userService: IUserService,
                        generatorService: IGeneratorService) =

    member this.GetGeneratedProblemModels(generatedProblemSetId: GeneratedProblemSetId) =
        generatorService.Get(generatedProblemSetId)
        |> Async.BindResult(fun generatedProblemSet ->
            generatedProblemSet.Problems
            |> Seq.map(fun x -> generatorService.Get(x))
            |> ResultOfAsyncSeq
        )

    member this.UpdateSubmission(answer: DatabaseTypes.ProblemAnswer) : Submission -> Result<Submission, Exception> =
        fun submission ->
            if submission.Deadline > DateTimeOffset.UtcNow then
                Ok({
                    submission with
                        Answers =
                            submission.Answers
                            |> Seq.where(fun ans -> ans.GeneratedProblemId <> answer.GeneratedProblemId)
                            |> Seq.append(seq { answer })
                            |> List.ofSeq
                })
            else
                Error(InvalidOperationException("Out of time") :> Exception)

    interface IExaminationService with

        member this.GetProblemSetPreview(commitId) = 
            versionControlService.Get(commitId)
            |> Async.BindResult(fun commit ->
                match commit.Target.ConcreteId with
                | Problem(id) ->
                    async.Return(Error(InvalidOperationException(sprintf "It's not problem set %s" commitId.Value) :> Exception))
                | ProblemSet(id) ->
                    problemsService.Get(id)
                    |> Async.MapResult(fun problemSet -> (problemSet, commit.AuthorId))
            )
            |> Async.BindResult(fun (problemSet, authorId) ->
                userService.Get(authorId)
                |> Async.TryMapResult(fun author -> ProblemSetPreviewModel.Create(problemSet, author))
            )

        member this.ApplyAnswer(answer, submissionId) =
            let problemAnswer = {
                ProblemAnswer.GeneratedProblemId = answer.GeneratedProblemId.Value
                Answer = answer.Answer.Value
                Timestamp = answer.Timestamp
            }

            submissionContext.Update(Submission.CreateDocumentKey(submissionId.Value),
                                     this.UpdateSubmission(problemAnswer))

        member this.Complete(submissionId, userId) =
            async {
                match! submissionContext.Get(Submission.CreateDocumentKey(submissionId.Value)) with
                | Error(ex) -> return Error(ex)
                | Ok(entity) ->
                    let submission = SubmissionModel(entity)
                    match submission.ReportId with
                    | Some(reportId) -> return Ok(reportId)
                    | None ->
                        match! this.GetGeneratedProblemModels(submission.GeneratedProblemSetId) with
                        | Error(ex) -> return Error(ex)
                        | Ok(generatedProblemModels) ->
                            let answersById =
                                submission.Answers
                                |> Seq.map(fun x -> (x.GeneratedProblemId, x))
                                |> Map.ofSeq

                            let! reports =
                                generatedProblemModels
                                |> Seq.map(fun x -> 
                                    async {
                                        let answerOption = answersById.TryFind(x.Id)
                                        match answerOption with
                                        | None ->
                                            return {
                                                ProblemReport.GeneratedProblemId = x.Id.Value
                                                Answer = None
                                                ExpectedAnswer = x.Answer.Value
                                                IsCorrect = false
                                                Timestamp = None
                                            }
                                        | Some(answer) ->
                                            match! generatorService.Validate(x.Id, answer.Answer) with
                                            | Error(ex) ->
                                                return {
                                                    ProblemReport.GeneratedProblemId = x.Id.Value
                                                    Answer = Some(answer.Answer.Value)
                                                    ExpectedAnswer = x.Answer.Value
                                                    IsCorrect = false
                                                    Timestamp = Some(answer.Timestamp)
                                                }
                                            | Ok(isCorrect) ->
                                                return {
                                                    ProblemReport.GeneratedProblemId = x.Id.Value
                                                    Answer = Some(answer.Answer.Value)
                                                    ExpectedAnswer = x.Answer.Value
                                                    IsCorrect = isCorrect
                                                    Timestamp = Some(answer.Timestamp)
                                                }
                                        
                                    })
                                |> Async.Parallel

                            let now = DateTimeOffset.UtcNow
                            let report = {
                                Report.Id = Guid.NewGuid().ToString()
                                GeneratedProblemSetId = submission.GeneratedProblemSetId.Value
                                SubmissionId = submissionId.Value
                                Permissions = entity.Permissions
                                StartedAt = submission.StartedAt
                                FinishedAt = if now < submission.Deadline then now else submission.Deadline
                                Answers = reports |> List.ofArray
                            }

                            let reportId = ReportId(report.Id)

                            return!
                                seq {
                                    reportContext.Insert(report, report)
                                    submissionContext.Update(Submission.CreateDocumentKey(submissionId.Value),
                                                             fun sub -> { sub with ReportId = Some(report.Id) })
                                    permissionsService.UserItemsAppend(ProtectedId.Report(reportId), userId)
                                }
                                |> ResultOfAsyncSeq
                                |> Async.MapResult(fun _ -> reportId)
            }

        member this.CreateSubmission(problemSetId, userId) =
            let submissionId = SubmissionId(Guid.NewGuid().ToString())
            generatorService.Generate(problemSetId)
            |> Async.BindResult generatorService.Get
            |> Async.MapResult(fun generatedProblemSet ->
                let startedAt = DateTimeOffset.UtcNow
                let deadline = startedAt.Add(generatedProblemSet.Duration)
                {
                    Submission.Id = submissionId.Value
                    GeneratedProblemSetId = generatedProblemSet.Id.Value
                    Permissions = {
                        Permissions.OwnerId = userId.Value
                        Groups = []
                        Members = []
                    }
                    StartedAt = startedAt
                    Deadline = deadline
                    Answers = List.empty
                    ReportId = None
                }
            )
            |> Async.BindResult(fun submission -> submissionContext.Insert(submission, submission))
            |> Async.BindResult(fun _ -> permissionsService.UserItemsAppend(ProtectedId.Submission(submissionId), userId))
            |> Async.MapResult(fun _ -> submissionId)

        member this.Get(id: ReportId) =
            reportContext.Get(Report.CreateDocumentKey(id.Value))
            |> Async.MapResult ReportModel

        member this.GetReports(userId: UserId) =
            permissionsService.Get(userId, AccessModel.CanRead, ProtectedType.Report)
            |> Async.BindResult(fun ids ->
                ids
                |> Seq.collect(fun id ->
                    match id with
                    | Report(reportId) -> [ reportId ]
                    | _ -> []
                )
                |> Seq.map (this :> IExaminationService).Get
                |> ResultOfAsyncSeq
            )

        member this.GetSubmissions(userId: UserId) =
            permissionsService.Get(userId, AccessModel.CanRead, ProtectedType.Submission)
            |> Async.BindResult(fun ids ->
                ids
                |> Seq.collect(fun id ->
                    match id with
                    | Submission(submissionId) -> [ submissionId ]
                    | _ -> []
                )
                |> Seq.map (this :> IExaminationService).Get
                |> ResultOfAsyncSeq
            )

        member this.GetProblemSets(userId: UserId) =
            permissionsService.Get(userId, AccessModel.CanGenerate, ProtectedType.Head)
            |> Async.BindResult(fun ids ->
                ids
                |> Seq.collect(fun id ->
                    match id with
                    | Head(headId) -> [ headId ]
                    | _ -> []
                )
                |> Seq.map versionControlService.Get
                |> AsyncSeq.ofSeqAsync
                |> AsyncSeq.map(fun r ->
                    match r with
                    | Error(error) -> Error([ error ])
                    | Ok(head) ->
                        match head.Commit.Target.Type with
                        | ModelType.ProblemSet -> Ok([ head ])
                        | _ -> Ok([])
                )
                |> AsyncSeq.fold (fun r x ->
                    match (r, x) with
                    | (Ok(l), Ok(r)) -> Ok(l @ r)
                    | (Error(ex), Ok(r)) -> Error(ex)
                    | (Ok(l), Error(ex)) -> Error(ex)
                    | (Error(lex), Error(rex)) -> Error(lex @ rex)
                ) (Ok([]))
                |> fun x ->
                    async {
                        match! x with
                        | Ok(list) -> return Ok(list)
                        | Error(exList) -> return Error(AggregateException(exList) :> Exception)
                    }
            )

        member this.Get(id: SubmissionId) =
            submissionContext.Get(Submission.CreateDocumentKey(id.Value))
            |> Async.MapResult SubmissionModel
