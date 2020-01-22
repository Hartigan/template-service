namespace Models.Permissions

open Models.Identificators
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
