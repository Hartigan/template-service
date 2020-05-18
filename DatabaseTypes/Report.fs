namespace DatabaseTypes

open System
open System.Text.Json.Serialization
open Utils
open DatabaseTypes.Identificators
open Utils.Converters

[<JsonConverter(typeof<ReportTypeConverter>)>]
type ReportType private () =
    inherit BaseType("report")
    static member Instance = ReportType()
and ReportTypeConverter() =
    inherit StringConverter<ReportType>((fun m -> m.Value), (fun _ -> ReportType.Instance))

type ProblemReport = {
    [<JsonPropertyName("generated_problem_id")>]
    GeneratedProblemId : GeneratedProblemId
    [<JsonPropertyName("answer")>]
    [<JsonConverter(typeof<OptionValueConverter<string>>)>]
    Answer : string option
    [<JsonPropertyName("expected_answer")>]
    ExpectedAnswer : string
    [<JsonPropertyName("is_correct")>]
    IsCorrect : bool
    [<JsonPropertyName("timestamp")>]
    [<JsonConverter(typeof<OptionValueConverter<DateTimeOffset>>)>]
    Timestamp : DateTimeOffset option
}

type Report =
    {
        [<JsonPropertyName("id")>]
        Id : ReportId
        [<JsonPropertyName("generated_problem_set_id")>]
        GeneratedProblemSetId : GeneratedProblemSetId
        [<JsonPropertyName("submission_id")>]
        SubmissionId : SubmissionId
        [<JsonPropertyName("permissions")>]
        Permissions : Permissions
        [<JsonPropertyName("started_at")>]
        StartedAt : DateTimeOffset
        [<JsonPropertyName("finished_at")>]
        FinishedAt : DateTimeOffset
        [<JsonPropertyName("answers")>]
        Answers : List<ProblemReport>
        [<JsonPropertyName("type")>]
        Type : ReportType
    }

    static member CreateDocumentKey(id: ReportId): DocumentKey =
        DocumentKey.Create(id.Value, ReportType.Instance.Value)
    member private this.DocKey = Report.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key


