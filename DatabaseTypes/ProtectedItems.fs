namespace DatabaseTypes

open System.Runtime.Serialization

[<DataContract>]
type ProtectedItem =
    {
        [<field: DataMember(Name = "id")>]
        Id : string
        [<field: DataMember(Name = "type")>]
        Type : string
    }

[<DataContract>]
type GroupItems = 
    {
        [<field: DataMember(Name = "user_id")>]
        GroupId : string
        [<field: DataMember(Name = "allowed")>]
        Allowed: List<ProtectedItem>
    }

    static member TypeName = "group_items"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, GroupItems.TypeName)
    member private this.DocKey = GroupItems.CreateDocumentKey(this.GroupId)

    [<DataMember(Name = "type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key

[<DataContract>]
type UserItems = 
    {
        [<field: DataMember(Name = "user_id")>]
        UserId : string
        [<field: DataMember(Name = "owned")>]
        Owned: List<ProtectedItem>
        [<field: DataMember(Name = "allowed")>]
        Allowed: List<ProtectedItem>
    }

    static member TypeName = "user_items"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, UserItems.TypeName)
    member private this.DocKey = UserItems.CreateDocumentKey(this.UserId)

    [<DataMember(Name = "type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
