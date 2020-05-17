namespace DatabaseTypes

open System.Text.Json.Serialization;


type GroupAccess =
    {
        [<JsonPropertyName("group_id")>]
        GroupId : string
        [<JsonPropertyName("access")>]
        Access : uint64
    }
