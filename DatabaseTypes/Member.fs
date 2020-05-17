namespace DatabaseTypes

open System.Text.Json.Serialization;


type Member =
    {
        [<JsonPropertyName("user_id")>]
        UserId : string
        [<JsonPropertyName("access")>]
        Access : uint64
    }
