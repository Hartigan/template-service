namespace DatabaseTypes

open System.Text.Json.Serialization

type UserGroup =
    {
        [<JsonPropertyName("id")>]
        Id : string
        [<JsonPropertyName("owner_id")>]
        OwnerId : string
        [<JsonPropertyName("name")>]
        Name : string
        [<JsonPropertyName("description")>]
        Description : string
        [<JsonPropertyName("members")>]                
        Members : List<Member>
    }

    static member TypeName = "user_group"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, UserGroup.TypeName)
    member private this.DocKey = UserGroup.CreateDocumentKey(this.Id)

    [<JsonPropertyName("type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key

