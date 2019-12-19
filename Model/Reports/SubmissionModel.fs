namespace Models.Reports

open DatabaseTypes
open Models.Identificators
open Models.Converters
open Models.Permissions
open Models.Problems
open System.Runtime.Serialization
open System.Text.Json.Serialization

type ProblemAnswerModel(entity: DatabaseTypes.ProblemAnswer) =
    [<DataMember(Name = "generated_problem_id")>]
    member val GeneratedProblemId = GeneratedProblemId(entity.GeneratedProblemId) with get
    [<DataMember(Name = "answer")>]
    member val Answer = ProblemAnswer(entity.Answer) with get
    [<DataMember(Name = "timestamp")>]
    member val Timestamp = entity.Timestamp with get


type SubmissionModel(entity: Submission) =
    [<DataMember(Name = "id")>]
    member val Id = SubmissionId(entity.Id) with get
    [<DataMember(Name = "generated_problem_set_id")>]
    member val GeneratedProblemSetId = GeneratedProblemSetId(entity.GeneratedProblemSetId) with get
    [<DataMember(Name = "permissions")>]
    member val Permissions = PermissionsModel(entity.Permissions) with get
    [<DataMember(Name = "started_at")>]
    member val StartedAt = entity.StartedAt with get
    [<DataMember(Name = "deadline")>]
    member val Deadline = entity.Deadline with get
    [<DataMember(Name = "answers")>]
    member val Answers = entity.Answers |> Seq.map(fun x -> ProblemAnswerModel(x)) |> Seq.toList with get
    [<DataMember(Name = "completed")>]
    member val Completed = entity.ReportId.IsSome with get
    [<DataMember(Name = "report_id")>]
    member val ReportId = entity.ReportId |> Option.map(ReportId) with get