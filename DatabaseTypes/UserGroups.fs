namespace DatabaseTypes

open System.Runtime.Serialization

[<DataContract>]
type UserGroups = 
    {
        [<field: DataMember(Name = "user_id")>]
        UserId : string
        [<field: DataMember(Name = "owned")>]
        Owned: List<string>
        [<field: DataMember(Name = "allowed")>]
        Allowed: List<string>
    }

    static member TypeName = "user_groups"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, UserGroups.TypeName)
    member private this.DocKey = UserGroups.CreateDocumentKey(this.UserId)

    [<DataMember(Name = "type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
