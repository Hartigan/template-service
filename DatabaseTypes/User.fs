namespace DatabaseTypes

open System.Text.Json.Serialization

type User =
    {
        [<JsonPropertyName("id")>]
        Id : string
        [<JsonPropertyName("first_name")>]
        FirstName : string
        [<JsonPropertyName("last_name")>]
        LastName : string
        [<JsonPropertyName("name")>]
        Name : string
        [<JsonPropertyName("normalized_name")>]
        NormalizedName : string
        [<JsonPropertyName("email")>]
        Email : string
        [<JsonPropertyName("email_confirmed")>]
        EmailConfirmed : bool
        [<JsonPropertyName("password_hash")>]
        PasswordHash : string
        [<JsonPropertyName("is_authenticated")>]
        IsAuthenticated : bool
        [<JsonPropertyName("authentication_type")>]
        AuthenticationType : string
    }

    static member TypeName = "user"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, User.TypeName)
    member private this.DocKey = User.CreateDocumentKey(this.Id)

    [<JsonPropertyName("type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
