namespace DatabaseTypes

open System.Text.Json.Serialization
open DatabaseTypes.Identificators


type GroupAccess =
    {
        [<JsonPropertyName("group_id")>]
        GroupId : GroupId
        [<JsonPropertyName("access")>]
        Access : uint64
    }
