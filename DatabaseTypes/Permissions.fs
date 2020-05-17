namespace DatabaseTypes

open System.Text.Json.Serialization

type Permissions = {
    [<JsonPropertyName("owner_id")>]
    OwnerId : string
    [<JsonPropertyName("groups")>]
    Groups: List<GroupAccess>
    [<JsonPropertyName("members")>]
    Members: List<Member>
}