namespace DatabaseTypes

open System.Text.Json.Serialization

type ProtectedItem =
    {
        [<JsonPropertyName("id")>]
        Id : string
        [<JsonPropertyName("type")>]
        Type : string
    }

type GroupItems = 
    {
        [<JsonPropertyName("user_id")>]
        GroupId : string
        [<JsonPropertyName("allowed")>]
        Allowed: List<ProtectedItem>
    }

    static member TypeName = "group_items"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, GroupItems.TypeName)
    member private this.DocKey = GroupItems.CreateDocumentKey(this.GroupId)

    [<JsonPropertyName("type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key

type UserItems = 
    {
        [<JsonPropertyName("user_id")>]
        UserId : string
        [<JsonPropertyName("owned")>]
        Owned: List<ProtectedItem>
        [<JsonPropertyName("allowed")>]
        Allowed: List<ProtectedItem>
    }

    static member TypeName = "user_items"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, UserItems.TypeName)
    member private this.DocKey = UserItems.CreateDocumentKey(this.UserId)

    [<JsonPropertyName("type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
