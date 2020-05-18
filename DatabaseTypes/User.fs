namespace DatabaseTypes

open System.Text.Json.Serialization
open DatabaseTypes.Identificators
open Utils.Converters

[<JsonConverter(typeof<UserTypeConverter>)>]
type UserType private () =
    inherit BaseType("user")
    static member Instance = UserType()
and UserTypeConverter() =
    inherit StringConverter<UserType>((fun m -> m.Value), (fun _ -> UserType.Instance))

type User =
    {
        [<JsonPropertyName("id")>]
        Id : UserId
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
        [<JsonPropertyName("type")>]
        Type : UserType
    }

    static member CreateDocumentKey(id: UserId): DocumentKey =
        DocumentKey.Create(id.Value, UserType.Instance.Value)
    member private this.DocKey = User.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
