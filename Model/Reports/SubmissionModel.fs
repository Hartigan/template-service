namespace Models.Reports

open DatabaseTypes
open Models.Identificators
open Models.Converters
open Models.Permissions
open Models.Problems
open System.Runtime.Serialization
open System.Text.Json.Serialization
open System
open Utils.ResultHelper

type ProblemAnswerModel =
    {
        [<JsonPropertyName("generated_problem_id")>]
        GeneratedProblemId  : GeneratedProblemId
        [<JsonPropertyName("answer")>]
        Answer              : ProblemAnswer
        [<JsonPropertyName("timestamp")>]
        Timestamp           : DateTimeOffset
    }

    static member Create(entity: DatabaseTypes.ProblemAnswer) : Result<ProblemAnswerModel, Exception> =
        Ok({
            GeneratedProblemId  = GeneratedProblemId(entity.GeneratedProblemId)
            Answer              = ProblemAnswer(entity.Answer)
            Timestamp           = entity.Timestamp
        })

type SubmissionModel = 
    {
        [<JsonPropertyName("id")>]
        Id                      : SubmissionId
        [<JsonPropertyName("generated_problem_set")>]
        GeneratedProblemSet     : GeneratedProblemSetModel
        [<JsonPropertyName("started_at")>]
        StartedAt               : DateTimeOffset
        [<JsonPropertyName("deadline")>]
        Deadline                : DateTimeOffset
        [<JsonPropertyName("answers")>]
        Answers                 : List<ProblemAnswerModel>
        [<JsonPropertyName("completed")>]
        Completed               : bool
        [<JsonPropertyName("report_id")>]
        ReportId                : option<ReportId>
    }

    static member Create(entity: Submission,
                         generatedProblemSet: GeneratedProblemSetModel) : Result<SubmissionModel, Exception> =
        let answersResult =
            entity.Answers
            |> Seq.map ProblemAnswerModel.Create
            |> ResultOfSeq

        match answersResult with
        | Error(error) -> Error(error)
        | Ok(answers) ->
            Ok({
                Id                      = SubmissionId(entity.Id)
                GeneratedProblemSet     = generatedProblemSet
                StartedAt               = entity.StartedAt
                Deadline                = entity.Deadline
                Answers                 = answers
                Completed               = entity.ReportId.IsSome
                ReportId                = entity.ReportId |> Option.map(ReportId)
            })
