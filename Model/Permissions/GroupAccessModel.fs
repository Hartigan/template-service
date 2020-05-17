namespace Models.Permissions

open DatabaseTypes.Identificators
open System.Text.Json.Serialization

type GroupAccessModel =
    {
        [<JsonPropertyName("group_id")>]
        GroupId: GroupId
        [<JsonPropertyName("name")>]
        Name: GroupName
        [<JsonPropertyName("access")>]
        Access: AccessModel
    }
