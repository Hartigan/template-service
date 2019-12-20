namespace DatabaseTypes

open System.Collections.Generic
open System.Runtime.Serialization

[<DataContract>]
type UserGroup =
    {
        [<field: DataMember(Name = "id")>]
        Id : string
        [<field: DataMember(Name = "owner_id")>]
        OwnerId : string
        [<field: DataMember(Name = "name")>]
        Name : string
        [<field: DataMember(Name = "description")>]
        Description : string
        [<field: DataMember(Name = "members")>]
        Members : List<Member>
    }

    static member TypeName = "user_group"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, UserGroup.TypeName)
    member private this.DocKey = UserGroup.CreateDocumentKey(this.Id)

    [<DataMember(Name = "type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key

