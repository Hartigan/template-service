namespace Models.Permissions

open DatabaseTypes
open Models.Identificators
open Models.Converters
open System.Runtime.Serialization
open System.Text.Json.Serialization

type PermissionsModel(permissions: Permissions) =
    [<DataMember(Name = "owner_id")>]
    [<JsonConverter(typeof<UserIdConverter>)>]
    member val OwnerId  = UserId(permissions.OwnerId) with get