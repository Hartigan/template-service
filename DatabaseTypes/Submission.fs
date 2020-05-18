namespace DatabaseTypes

open System.Text.Json.Serialization
open System
open Utils
open DatabaseTypes.Identificators
open Utils.Converters

[<JsonConverter(typeof<SubmissionTypeConverter>)>]
type SubmissionType private () =
    inherit BaseType("submission")
    static member Instance = SubmissionType()
and SubmissionTypeConverter() =
    inherit StringConverter<SubmissionType>((fun m -> m.Value), (fun _ -> SubmissionType.Instance))

type ProblemAnswer = {
    [<JsonPropertyName("generated_problem_id")>]
    GeneratedProblemId : GeneratedProblemId
    [<JsonPropertyName("answer")>]
    Answer : string
    [<JsonPropertyName("timestamp")>]
    Timestamp : DateTimeOffset
}

type Submission =
    {
        [<JsonPropertyName("id")>]
        Id : SubmissionId
        [<JsonPropertyName("generated_problem_set_id")>]
        GeneratedProblemSetId : GeneratedProblemSetId
        [<JsonPropertyName("permissions")>]
        Permissions : Permissions
        [<JsonPropertyName("started_at")>]
        StartedAt : DateTimeOffset
        [<JsonPropertyName("deadline")>]
        Deadline : DateTimeOffset
        [<JsonPropertyName("answers")>]
        Answers : List<ProblemAnswer>
        [<JsonPropertyName("report_id")>]
        [<JsonConverter(typeof<OptionValueConverter<ReportId>>)>]
        ReportId : ReportId option
        [<JsonPropertyName("type")>]
        Type : SubmissionType
    }

    static member CreateDocumentKey(id: SubmissionId): DocumentKey =
        DocumentKey.Create(id.Value, SubmissionType.Instance.Value)
    member private this.DocKey = Submission.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key


