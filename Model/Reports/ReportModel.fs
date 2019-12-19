namespace Models.Reports

open DatabaseTypes
open Models.Identificators
open Models.Converters
open Models.Permissions
open Models.Problems
open System.Runtime.Serialization
open System.Text.Json.Serialization


type ProblemReportModel(entity: ProblemReport) =
    [<DataMember(Name = "generated_problem_id")>]
    member val GeneratedProblemId = GeneratedProblemId(entity.GeneratedProblemId) with get
    [<DataMember(Name = "answer")>]
    member val Answer = entity.Answer |> Option.map(ProblemAnswer) with get
    [<DataMember(Name = "expected_answer")>]
    member val ExpectedAnswer = ProblemAnswer(entity.ExpectedAnswer) with get
    [<DataMember(Name = "is_correct")>]
    member val IsCorrect = entity.IsCorrect with get
    [<DataMember(Name = "timestamp")>]
    member val Timestamp = entity.Timestamp with get


type ReportModel(entity: Report) =
    [<DataMember(Name = "id")>]
    member val Id = ReportId(entity.Id) with get
    [<DataMember(Name = "generated_problem_set_id")>]
    member val GeneratedProblemSetId = GeneratedProblemSetId(entity.GeneratedProblemSetId) with get
    [<DataMember(Name = "submission_id")>]
    member val SubmissionId = SubmissionId(entity.SubmissionId) with get
    [<DataMember(Name = "permissions")>]
    member val Permissions = PermissionsModel(entity.Permissions) with get
    [<DataMember(Name = "started_at")>]
    member val StartedAt = entity.StartedAt with get
    [<DataMember(Name = "finished_at")>]
    member val FinishedAt = entity.FinishedAt with get
    [<DataMember(Name = "answers")>]
    member val Answers = entity.Answers |> Seq.map(fun x -> ProblemReportModel(x)) |> Seq.toList with get