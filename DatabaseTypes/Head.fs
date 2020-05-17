namespace DatabaseTypes

open System.Text.Json.Serialization

type Head =
    {
        [<JsonPropertyName("id")>]
        Id : string
        [<JsonPropertyName("name")>]
        Name : string
        [<JsonPropertyName("commit")>]
        Commit : Commit
        [<JsonPropertyName("permissions")>]
        Permissions : Permissions
    }

    static member TypeName = "head"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, Head.TypeName)
    member private this.DocKey = Head.CreateDocumentKey(this.Id)

    [<JsonPropertyName("type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key


