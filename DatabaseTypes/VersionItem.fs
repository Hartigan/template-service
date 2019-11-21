namespace DatabaseTypes

open System
open System.Runtime.Serialization

[<DataContract>]
type VersionItem =
    {
        [<field: DataMember(Name = "id")>]
        Id : string
        [<field: DataMember(Name = "author_id")>]
        AuthorId : string
        [<field: DataMember(Name = "target_id")>]
        TargetId : string
        [<field: DataMember(Name = "target_type")>]
        TargetType : string
        [<field: DataMember(Name = "timestamp")>]
        Timestamp : DateTimeOffset
        [<field: DataMember(Name = "parent_id")>]
        ParentId : string
    }

    static member TypeName = "version_item"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, VersionItem.TypeName)
    member private this.DocKey = VersionItem.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        [<DataMember(Name = "type")>]
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
