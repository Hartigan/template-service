namespace DatabaseTypes

open System.Text.Json.Serialization
open System
open Utils

type ProblemAnswer = {
    [<JsonPropertyName("generated_problem_id")>]
    GeneratedProblemId : string
    [<JsonPropertyName("answer")>]
    Answer : string
    [<JsonPropertyName("timestamp")>]
    Timestamp : DateTimeOffset
}

type Submission =
    {
        [<JsonPropertyName("id")>]
        Id : string
        [<JsonPropertyName("generated_problem_set_id")>]
        GeneratedProblemSetId : string
        [<JsonPropertyName("permissions")>]
        Permissions : Permissions
        [<JsonPropertyName("started_at")>]
        StartedAt : DateTimeOffset
        [<JsonPropertyName("deadline")>]
        Deadline : DateTimeOffset
        [<JsonPropertyName("answers")>]
        Answers : List<ProblemAnswer>
        [<JsonPropertyName("report_id")>]
        [<JsonConverter(typeof<OptionValueConverter<string>>)>]
        ReportId : string option
    }

    static member TypeName = "submission"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, Submission.TypeName)
    member private this.DocKey = Submission.CreateDocumentKey(this.Id)

    [<JsonPropertyName("type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key


