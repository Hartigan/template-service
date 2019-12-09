namespace DatabaseTypes

open System
open System.Runtime.Serialization

[<DataContract>]
type Target =
    {
        [<field: DataMember(Name = "id")>]
        Id : string
        [<field: DataMember(Name = "type")>]
        Type : string
    }

[<DataContract>]
type Commit =
    {
        [<field: DataMember(Name = "id")>]
        Id : string
        [<field: DataMember(Name = "head_id")>]
        HeadId : string
        [<field: DataMember(Name = "author_id")>]
        AuthorId : string
        [<field: DataMember(Name = "target")>]
        Target : Target
        [<field: DataMember(Name = "timestamp")>]
        Timestamp : DateTimeOffset
        [<field: DataMember(Name = "parent_id")>]
        ParentId : string
        [<field: DataMember(Name = "description")>]
        Description : string
    }

    static member TypeName = "commit"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, Commit.TypeName)
    member private this.DocKey = Commit.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        [<DataMember(Name = "type")>]
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
