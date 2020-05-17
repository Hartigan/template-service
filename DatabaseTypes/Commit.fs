namespace DatabaseTypes

open System
open System.Text.Json.Serialization

type Target =
    {
        [<JsonPropertyName("id")>]
        Id : string
        [<JsonPropertyName("type")>]
        Type : string
    }

type Commit =
    {
        [<JsonPropertyName("id")>]
        Id : string
        [<JsonPropertyName("head_id")>]
        HeadId : string
        [<JsonPropertyName("author_id")>]
        AuthorId : string
        [<JsonPropertyName("target")>]
        Target : Target
        [<JsonPropertyName("timestamp")>]
        Timestamp : DateTimeOffset
        [<JsonPropertyName("parent_id")>]
        ParentId : string
        [<JsonPropertyName("description")>]
        Description : string
    }

    static member TypeName = "commit"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, Commit.TypeName)
    member private this.DocKey = Commit.CreateDocumentKey(this.Id)

    [<JsonPropertyName("type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
