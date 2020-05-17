namespace DatabaseTypes

open System.Text.Json.Serialization

type UserGroups = 
    {
        [<JsonPropertyName("user_id")>]
        UserId : string
        [<JsonPropertyName("owned")>]
        Owned: List<string>
        [<JsonPropertyName("allowed")>]
        Allowed: List<string>
    }

    static member TypeName = "user_groups"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, UserGroups.TypeName)
    member private this.DocKey = UserGroups.CreateDocumentKey(this.UserId)

    [<JsonPropertyName("type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
