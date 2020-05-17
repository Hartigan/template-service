namespace DatabaseTypes

open System.Text.Json.Serialization

type ProblemSet =
    {
        [<JsonPropertyName("id")>]
        Id : string
        [<JsonPropertyName("title")>]
        Title : string
        [<JsonPropertyName("head_ids")>]
        Heads : System.Collections.Generic.List<string>
        [<JsonPropertyName("duration")>]
        Duration : int32
    }

    static member TypeName = "problem_set"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, ProblemSet.TypeName)
    member private this.DocKey = ProblemSet.CreateDocumentKey(this.Id)

    [<JsonPropertyName("type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
