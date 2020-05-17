namespace Services.Examination

open Contexts
open DatabaseTypes
open DatabaseTypes.Identificators
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

    member this.TryComplete(submissionId: SubmissionId) : Async<Result<Submission, Exception>> =
        submissionContext.Get(Submission.CreateDocumentKey(submissionId.Value))
        |> Async.BindResult(fun s ->
            if s.Deadline < DateTimeOffset.UtcNow then
                permissionsService.GetOwner(ProtectedId.Submission(submissionId))
                |> Async.BindResult(fun userId ->
                    (this :> IExaminationService).Complete(submissionId, userId)
                )
                |> Async.BindResult(fun _ ->
                    submissionContext.Get(Submission.CreateDocumentKey(submissionId.Value))
                )
            else
                async.Return(Ok(s))
        )

    interface IExaminationService with
        member this.GetPreview(submissionId: SubmissionId) =
            this.TryComplete(submissionId)
            |> Async.BindResult(fun submission ->
                generatorService.Get(GeneratedProblemSetId(submission.GeneratedProblemSetId))
                |> Async.BindResult(fun generatedProblemSet ->
                    permissionsService.GetOwner(ProtectedId.Submission(submissionId))
                    |> Async.BindResult userService.Get
                    |> Async.TryMapResult(fun author ->
                        SubmissionPreviewModel.Create(submission, generatedProblemSet.Title, author)
                    )
                )
            )


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

        member this.ApplyAnswer(generatedProblemId, answer, submissionId) =
            let problemAnswer = {
                ProblemAnswer.GeneratedProblemId = generatedProblemId.Value
                Answer = answer.Value
                Timestamp = DateTimeOffset.UtcNow
            }

            submissionContext.Update(Submission.CreateDocumentKey(submissionId.Value),
                                     this.UpdateSubmission(problemAnswer))

        member this.Complete(submissionId, userId) =
            submissionContext.Get(Submission.CreateDocumentKey(submissionId.Value))
            |> Async.BindResult(fun entity ->
                match entity.ReportId with
                | Some(reportId) -> async.Return(Ok(ReportId(reportId)))
                | None ->
                    let generatedProblemSetId = GeneratedProblemSetId(entity.GeneratedProblemSetId)
                    let reportId = ReportId(Guid.NewGuid().ToString())

                    generatorService.Get(generatedProblemSetId)
                    |> Async.BindResult(fun generatedProblemSet ->
                        generatedProblemSet.Problems
                        |> Seq.map(fun x -> generatorService.Get(x))
                        |> ResultOfAsyncSeq
                    )
                    |> Async.BindResult(fun generatedProblems ->
                        let answersById =
                            entity.Answers
                            |> Seq.map(fun x -> (GeneratedProblemId(x.GeneratedProblemId), x))
                            |> Map.ofSeq
                        generatedProblems
                        |> Seq.map(fun generatedProblem ->
                            match answersById.TryFind(generatedProblem.Id) with
                            | None ->
                                async.Return(Ok({
                                    ProblemReport.GeneratedProblemId = generatedProblem.Id.Value
                                    Answer = None
                                    ExpectedAnswer = generatedProblem.Answer.Value
                                    IsCorrect = false
                                    Timestamp = None
                                }))
                            | Some(actualAnswer) ->
                                generatorService.Validate(generatedProblem.Id, ProblemAnswer(actualAnswer.Answer))
                                |> Async.MapResult(fun isCorrect ->
                                    {
                                        ProblemReport.GeneratedProblemId = generatedProblem.Id.Value
                                        Answer = Some(actualAnswer.Answer)
                                        ExpectedAnswer = generatedProblem.Answer.Value
                                        IsCorrect = isCorrect
                                        Timestamp = Some(actualAnswer.Timestamp)
                                    }
                                )
                        )
                        |> ResultOfAsyncSeq
                    )
                    |> Async.MapResult(fun answersReports ->
                        let now = DateTimeOffset.UtcNow
                        {
                            Report.Id = reportId.Value
                            GeneratedProblemSetId = entity.GeneratedProblemSetId
                            SubmissionId = submissionId.Value
                            Permissions = entity.Permissions
                            StartedAt = entity.StartedAt
                            FinishedAt = if now < entity.Deadline then now else entity.Deadline
                            Answers = answersReports
                        }
                    )
                    |> Async.BindResult(fun report -> reportContext.Insert(report, report))
                    |> Async.BindResult(fun _ ->
                        submissionContext.Update(Submission.CreateDocumentKey(submissionId.Value),
                                                 fun sub -> { sub with ReportId = Some(reportId.Value) })
                    )
                    |> Async.BindResult(fun _ -> permissionsService.UserItemsAppend(ProtectedId.Report(reportId), userId))
                    |> Async.MapResult(fun _ -> reportId)
            )

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
            |> Async.BindResult(fun report ->
                generatorService.Get(GeneratedProblemSetId(report.GeneratedProblemSetId))
                |> Async.BindResult(fun problemSet ->
                    report.Answers
                    |> Seq.map(fun ans ->
                        generatorService.Get(GeneratedProblemId(ans.GeneratedProblemId))
                        |> Async.TryMapResult(fun problem ->
                            ProblemReportModel.Create(ans, problem)
                        )
                    )
                    |> ResultOfAsyncSeq
                    |> Async.TryMapResult(fun problems ->
                        ProblemSetReportModel.Create(problemSet, problems)
                    )
                )
                |> Async.BindResult(fun problemSetReport ->
                    permissionsService.GetOwner(ProtectedId.Report(id))
                    |> Async.BindResult userService.Get
                    |> Async.TryMapResult(fun author ->
                        ReportModel.Create(report, problemSetReport, author)
                    )
                )
            )

        member this.GetReports(userId: UserId) =
            permissionsService.Get(userId, AccessModel.CanRead, ProtectedType.Report)
            |> Async.MapResult(fun ids ->
                ids
                |> Seq.collect(fun id ->
                    match id with
                    | Report(reportId) -> [ reportId ]
                    | _ -> []
                )
                |> List.ofSeq
            )

        member this.GetSubmissions(userId: UserId) =
            permissionsService.Get(userId, AccessModel.CanRead, ProtectedType.Submission)
            |> Async.MapResult(fun ids ->
                ids
                |> Seq.collect(fun id ->
                    match id with
                    | Submission(submissionId) -> [ submissionId ]
                    | _ -> []
                )
                |> List.ofSeq
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
            this.TryComplete(id)
            |> Async.BindResult(fun submission ->
                generatorService.Get(GeneratedProblemSetId(submission.GeneratedProblemSetId))
                |> Async.BindResult(fun generatedProblemSet ->
                    generatedProblemSet.Problems
                    |> Seq.map generatorService.Get
                    |> ResultOfAsyncSeq
                    |> Async.TryMapResult(fun generatedProblems ->
                        SubmissionProblemSetModel.Create(generatedProblemSet, generatedProblems)
                    )
                )
                |> Async.BindResult(fun submissionProblemSet ->
                    permissionsService.GetOwner(ProtectedId.Submission(id))
                    |> Async.BindResult userService.Get
                    |> Async.TryMapResult(fun author ->
                        SubmissionModel.Create(submission, submissionProblemSet, author)
                    )
                )
            )
