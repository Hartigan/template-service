namespace DatabaseTypes

open System.Runtime.Serialization

[<DataContract>]
type UserRole =
    {
        [<field: DataMember(Name = "id")>]
        Id : string
        [<field: DataMember(Name = "name")>]
        Name : string
    }

    static member TypeName = "user_role"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, UserRole.TypeName)
    member private this.DocKey = UserRole.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        [<DataMember(Name = "type")>]
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
