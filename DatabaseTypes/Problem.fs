namespace DatabaseTypes

open System.Text.Json.Serialization

type Problem =
    {
        [<JsonPropertyName("id")>]
        Id : string
        [<JsonPropertyName("title")>]
        Title : string
        [<JsonPropertyName("view")>]
        View : Code
        [<JsonPropertyName("controller")>]
        Controller : Code
        [<JsonPropertyName("validator")>]
        Validator : Code
    }

    static member TypeName = "problem"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, Problem.TypeName)
    member private this.DocKey = Problem.CreateDocumentKey(this.Id)

    [<JsonPropertyName("type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
