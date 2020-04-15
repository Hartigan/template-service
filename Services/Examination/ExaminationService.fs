namespace Services.Examination

open Contexts
open DatabaseTypes
open Models.Identificators
open Models.Reports
open Services.Problems
open System
open Utils.ResultHelper

type ExaminationService(reportContext: IReportContext,
                        submissionContext: ISubmissionContext,
                        problemsService: IProblemsService,
                        generatorService: IGeneratorService) =

    member this.GetGeneratedProblemModels(generatedProblemSetId: GeneratedProblemSetId) =
        async {
            match! generatorService.Get(generatedProblemSetId) with
            | Error(ex) -> return Error(ex)
            | Ok(generatedProblemSet) ->
                let! results =
                    generatedProblemSet.Problems
                    |> Seq.map(fun x -> generatorService.Get(x))
                    |> Async.Parallel

                return ResultOfSeq results
        }

        member this.UpdateSubmission(answer: ProblemAnswer) : Submission -> Result<Submission, Exception> =
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
        member this.ApplyAnswer(answer, submissionId) =
            let problemAnswer = {
                ProblemAnswer.GeneratedProblemId = answer.GeneratedProblemId.Value
                Answer = answer.Answer.Value
                Timestamp = answer.Timestamp
            }

            submissionContext.Update(Submission.CreateDocumentKey(submissionId.Value),
                                     this.UpdateSubmission(problemAnswer))

        member this.Complete(submissionId) = 
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

                            match! reportContext.Insert(report, report) with
                            | Error(ex) -> return Error(ex)
                            | Ok() ->
                                match! submissionContext.Update(Submission.CreateDocumentKey(submissionId.Value),
                                                                fun sub -> { sub with ReportId = Some(report.Id) }) with
                                | Error(ex) -> return Error(ex)
                                | Ok() -> return Ok(ReportId(report.Id))
            }

        member this.CreateSubmission(problemSetId, userId) = 
            async {
                match! generatorService.Generate(problemSetId) with
                | Error(ex) -> return Error(ex)
                | Ok(generatedProblemSetId) ->
                    match! generatorService.Get(generatedProblemSetId) with
                    | Error(ex) -> return Error(ex)
                    | Ok(generatedProblemSet) ->
                        let startedAt = DateTimeOffset.UtcNow
                        let deadline = startedAt.Add(generatedProblemSet.Duration)
                        let submission = {
                            Submission.Id = Guid.NewGuid().ToString()
                            GeneratedProblemSetId = generatedProblemSetId.Value
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
                        match! submissionContext.Insert(submission, submission) with
                        | Error(ex) -> return Error(ex)
                        | Ok() -> return Ok(SubmissionId(submission.Id))
            }

        member this.Get(id: ReportId) =
            async {
                match! reportContext.Get(Report.CreateDocumentKey(id.Value)) with
                | Error(ex) -> return Error(ex)
                | Ok(entity) -> return Ok(ReportModel(entity))
            }

        member this.GetReports(userId: UserId) =
            async {
                match! reportContext.GetByUser(userId.Value) with
                | Error(ex) -> return Error(ex)
                | Ok(entities) -> return entities |> Seq.map(ReportModel) |> Seq.toList |> Ok
            }

        member this.GetSubmissions(userId: UserId) =
            async {
                match! submissionContext.GetByUser(userId.Value) with
                | Error(ex) -> return Error(ex)
                | Ok(entities) -> return entities |> Seq.map(SubmissionModel) |> Seq.toList |> Ok
            }

        member this.Get(id: SubmissionId) =
            async {
                match! submissionContext.Get(Submission.CreateDocumentKey(id.Value)) with
                | Error(ex) -> return Error(ex)
                | Ok(entity) -> return Ok(SubmissionModel(entity))
            }
