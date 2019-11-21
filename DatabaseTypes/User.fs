namespace DatabaseTypes

open System.Runtime.Serialization

[<DataContract>]
type User =
    {
        [<field: DataMember(Name = "id")>]
        Id : string
        [<field: DataMember(Name = "first_name")>]
        FirstName : string
        [<field: DataMember(Name = "last_name")>]
        LastName : string
        [<field: DataMember(Name = "name")>]
        Name : string
        [<field: DataMember(Name = "normalized_name")>]
        NormalizedName : string
        [<field: DataMember(Name = "email")>]
        Email : string
        [<field: DataMember(Name = "email_confirmed")>]
        EmailConfirmed : bool
        [<field: DataMember(Name = "password_hash")>]
        PasswordHash : string
        [<field: DataMember(Name = "is_authenticated")>]
        IsAuthenticated : bool
        [<field: DataMember(Name = "authentication_type")>]
        AuthenticationType : string
    }

    static member TypeName = "user"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, User.TypeName)
    member private this.DocKey = User.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        [<DataMember(Name = "type")>]
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
