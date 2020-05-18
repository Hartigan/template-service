namespace DatabaseTypes

open System.Text.Json.Serialization
open Utils.Converters

[<JsonConverter(typeof<UserRoleTypeConverter>)>]
type UserRoleType private () =
    inherit BaseType("user_role")
    static member Instance = UserRoleType()
and UserRoleTypeConverter() =
    inherit StringConverter<UserRoleType>((fun m -> m.Value), (fun _ -> UserRoleType.Instance))

type UserRole =
    {
        [<JsonPropertyName("id")>]
        Id : string
        [<JsonPropertyName("name")>]
        Name : string
        [<JsonPropertyName("type")>]
        Type : UserRoleType
    }

    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, UserRoleType.Instance.Value)
    member private this.DocKey = UserRole.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
