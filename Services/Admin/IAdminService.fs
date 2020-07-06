namespace Services.Admin

open DatabaseTypes.Identificators
open System
open Contexts
open System.Text.Json.Serialization

type UserModel =
    {
        [<JsonPropertyName("id")>]
        Id: UserId
        [<JsonPropertyName("username")>]
        Username: string
        [<JsonPropertyName("first_name")>]
        FirstName: string
        [<JsonPropertyName("last_name")>]
        LastName: string
        [<JsonPropertyName("email")>]
        Email: string
        [<JsonPropertyName("roles")>]
        Roles: List<string>
    }

type IAdminService =
    abstract member GetUsers : unit -> Async<Result<List<UserModel>, Exception>>
    abstract member UpdateRoles : UserId * List<string> -> Async<Result<unit, Exception>>