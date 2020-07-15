namespace DatabaseTypes

open System.Text.Json.Serialization
open DatabaseTypes.Identificators

type Permissions = {
    [<JsonPropertyName("owner_id")>]
    OwnerId : UserId
    [<JsonPropertyName("groups")>]
    Groups: List<GroupAccess>
    [<JsonPropertyName("members")>]
    Members: List<Member>
    [<JsonPropertyName("is_public")>]
    IsPublic: bool
}