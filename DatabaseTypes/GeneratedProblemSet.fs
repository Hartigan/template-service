namespace DatabaseTypes

open System.Text.Json.Serialization

type GeneratedProblemSet =
    {
        [<JsonPropertyName("id")>]
        Id : string
        [<JsonPropertyName("problems")>]
        Problems : List<string>
        [<JsonPropertyName("title")>]
        Title : string
        [<JsonPropertyName("view")>]
        Duration : int32
    }

    static member TypeName = "generated_problem_set"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, GeneratedProblemSet.TypeName)
    member private this.DocKey = GeneratedProblemSet.CreateDocumentKey(this.Id)

    [<JsonPropertyName("type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
