namespace DatabaseTypes

open System
open System.Text.Json.Serialization
open Utils

type ProblemReport = {
    [<JsonPropertyName("generated_problem_id")>]
    GeneratedProblemId : string
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
        Id : string
        [<JsonPropertyName("generated_problem_set_id")>]
        GeneratedProblemSetId : string
        [<JsonPropertyName("submission_id")>]
        SubmissionId : string
        [<JsonPropertyName("permissions")>]
        Permissions : Permissions
        [<JsonPropertyName("started_at")>]
        StartedAt : DateTimeOffset
        [<JsonPropertyName("finished_at")>]
        FinishedAt : DateTimeOffset
        [<JsonPropertyName("answers")>]
        Answers : List<ProblemReport>
    }

    static member TypeName = "report"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, Report.TypeName)
    member private this.DocKey = Report.CreateDocumentKey(this.Id)

    [<JsonPropertyName("type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key


