namespace Services.Examination

open Contexts
open DatabaseTypes
open Models.Identificators
open Models.Reports
open Services.Problems
open System

type ExaminationService(reportContext: ReportContext,
                        submissionContext: SubmissionContext,
                        problemsService: IProblemsService,
                        generatorService: IGeneratorService) =

    member this.GetGeneratedProblemModels(generatedProblemSetId: GeneratedProblemSetId) =
        async {
            match! generatorService.Get(generatedProblemSetId) with
            | Result.Error(fail) ->
                match fail with
                | GetFail.Error(error) -> return Result.Error(CompleteSubmissionFail.Error(error))
            | Ok(generatedProblemSet) ->
                let! results =
                    generatedProblemSet.Problems
                    |> Seq.map(fun x -> generatorService.Get(x))
                    |> Async.Parallel

                let res =
                    results
                    |> Seq.map(fun x ->
                        match x with
                        | Result.Error(fail) ->
                            match fail with
                            | GetFail.Error(error) -> Result.Error(CompleteSubmissionFail.Error(error))
                        | Ok(generatedProblem) -> Ok([ generatedProblem ]))
                    |> Seq.reduce(fun a b ->
                        match (a, b) with
                        | (Ok(listA), Ok(listB)) -> Ok(listA @ listB)
                        | (Result.Error(fail), _) -> Result.Error(fail)
                        | (_, Result.Error(fail)) -> Result.Error(fail))

                return res
        }

        member this.UpdateSubmission(answer: ProblemAnswer) : Submission -> Result<Submission, ApplyAnswerFail> =
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
                    Result.Error(ApplyAnswerFail.OutOfTime())

    interface IExaminationService with
        member this.ApplyAnswer(answer, submissionId) =
            async {
                let problemAnswer = {
                    ProblemAnswer.GeneratedProblemId = answer.GeneratedProblemId.Value
                    Answer = answer.Answer.Value
                    Timestamp = answer.Timestamp
                }

                match! (submissionContext :> IContext<Submission>).Update(Submission.CreateDocumentKey(submissionId.Value),
                                                                          this.UpdateSubmission(problemAnswer)) with
                | Ok() -> return Ok()
                | Result.Error(fail) ->
                    match fail with
                    | GenericUpdateDocumentFail.Error(error) -> return Result.Error(ApplyAnswerFail.Error(error))
                    | GenericUpdateDocumentFail.CustomFail(customFail) -> return Result.Error(customFail)
            }

        member this.Complete(submissionId) = 
            async {
                match! (submissionContext :> IContext<Submission>).Get(Submission.CreateDocumentKey(submissionId.Value)) with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) -> return Result.Error(CompleteSubmissionFail.Error(error))
                | Ok(entity) ->
                    let submission = SubmissionModel(entity)
                    match submission.ReportId with
                    | Some(reportId) -> return Ok(reportId)
                    | None ->
                        match! this.GetGeneratedProblemModels(submission.GeneratedProblemSetId) with
                        | Result.Error(fail) -> return Result.Error(fail)
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
                                            | Result.Error(fail) ->
                                                match fail with
                                                | GenerateFail.Error(error) ->
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

                            match! (reportContext :> IContext<Report>).Insert(report, report) with
                            | Result.Error(fail) ->
                                match fail with
                                | InsertDocumentFail.Error(error) -> return Result.Error(CompleteSubmissionFail.Error(error))
                            | Ok() ->
                                match! (submissionContext :> IContext<Submission>).Update(Submission.CreateDocumentKey(submissionId.Value),
                                                                                          fun sub -> { sub with ReportId = Some(report.Id) }) with
                                | Result.Error(fail) ->
                                    match fail with
                                    | UpdateDocumentFail.Error(error) -> return Result.Error(CompleteSubmissionFail.Error(error))
                                | Ok() -> return Result.Ok(ReportId(report.Id))
            }

        member this.CreateSubmission(problemSetId, userId) = 
            async {
                match! generatorService.Generate(problemSetId) with
                | Result.Error(fail) ->
                    match fail with
                    | GenerateFail.Error(error) -> return Result.Error(CreateSubmissionFail.Error(error))
                | Ok(generatedProblemSetId) ->
                    match! generatorService.Get(generatedProblemSetId) with
                    | Result.Error(fail) ->
                        match fail with
                        | GetFail.Error(error) -> return Result.Error(CreateSubmissionFail.Error(error))
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
                        match! (submissionContext :> IContext<Submission>).Insert(submission, submission) with
                        | Result.Error(fail) ->
                            match fail with
                            | InsertDocumentFail.Error(error) -> return Result.Error(CreateSubmissionFail.Error(error))
                        | Ok() -> return Ok(SubmissionId(submission.Id))
            }

        member this.Get(id: ReportId) =
            async {
                match! (reportContext :> IContext<Report>).Get(Report.CreateDocumentKey(id.Value)) with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) -> return Result.Error(Services.Examination.GetFail.Error(error))
                | Ok(entity) -> return Ok(ReportModel(entity))
            }

        member this.GetReports(userId: UserId) =
            async {
                match! reportContext.GetByUser(userId.Value) with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) -> return Result.Error(Services.Examination.GetFail.Error(error))
                | Ok(entities) -> return entities |> Seq.map(ReportModel) |> Seq.toList |> Ok
            }

        member this.GetSubmissions(userId: UserId) =
            async {
                match! submissionContext.GetByUser(userId.Value) with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) -> return Result.Error(Services.Examination.GetFail.Error(error))
                | Ok(entities) -> return entities |> Seq.map(SubmissionModel) |> Seq.toList |> Ok
            }

        member this.Get(id: SubmissionId) =
            async {
                match! (submissionContext :> IContext<Submission>).Get(Submission.CreateDocumentKey(id.Value)) with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) -> return Result.Error(Services.Examination.GetFail.Error(error))
                | Ok(entity) -> return Ok(SubmissionModel(entity))
            }
