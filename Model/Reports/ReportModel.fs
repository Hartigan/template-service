namespace Models.Reports

open DatabaseTypes
open Models.Identificators
open Models.Converters
open Models.Permissions
open Models.Problems
open System.Runtime.Serialization
open System.Text.Json.Serialization


type ProblemReportModel(entity: ProblemReport) =
    [<JsonPropertyName("generated_problem_id")>]
    member val GeneratedProblemId = GeneratedProblemId(entity.GeneratedProblemId) with get
    [<JsonPropertyName("answer")>]
    member val Answer = entity.Answer |> Option.map(ProblemAnswer) with get
    [<JsonPropertyName("expected_answer")>]
    member val ExpectedAnswer = ProblemAnswer(entity.ExpectedAnswer) with get
    [<JsonPropertyName("is_correct")>]
    member val IsCorrect = entity.IsCorrect with get
    [<JsonPropertyName("timestamp")>]
    member val Timestamp = entity.Timestamp with get


type ReportModel(entity: Report) =
    [<JsonPropertyName("id")>]
    member val Id = ReportId(entity.Id) with get
    [<JsonPropertyName("generated_problem_set_id")>]
    member val GeneratedProblemSetId = GeneratedProblemSetId(entity.GeneratedProblemSetId) with get
    [<JsonPropertyName("submission_id")>]
    member val SubmissionId = SubmissionId(entity.SubmissionId) with get
    [<JsonPropertyName("started_at")>]
    member val StartedAt = entity.StartedAt with get
    [<JsonPropertyName("finished_at")>]
    member val FinishedAt = entity.FinishedAt with get
    [<JsonPropertyName("answers")>]
    member val Answers = entity.Answers |> Seq.map(fun x -> ProblemReportModel(x)) |> Seq.toList with get