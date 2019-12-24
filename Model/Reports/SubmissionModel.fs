namespace Models.Reports

open DatabaseTypes
open Models.Identificators
open Models.Converters
open Models.Permissions
open Models.Problems
open System.Runtime.Serialization
open System.Text.Json.Serialization

type ProblemAnswerModel(entity: DatabaseTypes.ProblemAnswer) =
    [<JsonPropertyName("generated_problem_id")>]
    member val GeneratedProblemId = GeneratedProblemId(entity.GeneratedProblemId) with get
    [<JsonPropertyName("answer")>]
    member val Answer = ProblemAnswer(entity.Answer) with get
    [<JsonPropertyName("timestamp")>]
    member val Timestamp = entity.Timestamp with get


type SubmissionModel(entity: Submission) =
    [<JsonPropertyName("id")>]
    member val Id = SubmissionId(entity.Id) with get
    [<JsonPropertyName("generated_problem_set_id")>]
    member val GeneratedProblemSetId = GeneratedProblemSetId(entity.GeneratedProblemSetId) with get
    [<JsonPropertyName("permissions")>]
    member val Permissions = PermissionsModel(entity.Permissions) with get
    [<JsonPropertyName("started_at")>]
    member val StartedAt = entity.StartedAt with get
    [<JsonPropertyName("deadline")>]
    member val Deadline = entity.Deadline with get
    [<JsonPropertyName("answers")>]
    member val Answers = entity.Answers |> Seq.map(fun x -> ProblemAnswerModel(x)) |> Seq.toList with get
    [<JsonPropertyName("completed")>]
    member val Completed = entity.ReportId.IsSome with get
    [<JsonPropertyName("report_id")>]
    member val ReportId = entity.ReportId |> Option.map(ReportId) with get