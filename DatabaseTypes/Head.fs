namespace DatabaseTypes

open System.Runtime.Serialization

[<DataContract>]
type Head =
    {
        [<field: DataMember(Name = "id")>]
        Id : string
        [<field: DataMember(Name = "name")>]
        Name : string
        [<field: DataMember(Name = "commit")>]
        Commit : Commit
        [<field: DataMember(Name = "permissions")>]
        Permissions : Permissions
    }

    static member TypeName = "head"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, Head.TypeName)
    member private this.DocKey = Head.CreateDocumentKey(this.Id)

    [<DataMember(Name = "type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key


