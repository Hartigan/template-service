namespace DatabaseTypes

open System.Text.Json.Serialization

type Code =
    {
        [<JsonPropertyName("language")>]
        Language : string
        [<JsonPropertyName("content")>]
        Content : string
    }
