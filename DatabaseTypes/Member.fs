namespace DatabaseTypes

open System.Text.Json.Serialization;
open DatabaseTypes.Identificators


type Member =
    {
        [<JsonPropertyName("user_id")>]
        UserId : UserId
        [<JsonPropertyName("access")>]
        Access : uint64
    }
