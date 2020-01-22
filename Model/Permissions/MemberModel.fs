namespace Models.Permissions

open Models.Identificators
open System.Text.Json.Serialization

type MemberModel =
    {
        [<JsonPropertyName("user_id")>]
        UserId: UserId
        [<JsonPropertyName("name")>]
        Name: Username
        [<JsonPropertyName("access")>]
        Access: AccessModel
    }
