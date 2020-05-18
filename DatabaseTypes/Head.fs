namespace DatabaseTypes

open System.Text.Json.Serialization
open DatabaseTypes.Identificators
open Utils.Converters

[<JsonConverter(typeof<HeadTypeConverter>)>]
type HeadType private () =
    inherit BaseType("head")
    static member Instance = HeadType()
and HeadTypeConverter() =
    inherit StringConverter<HeadType>((fun m -> m.Value), (fun _ -> HeadType.Instance))

type Head =
    {
        [<JsonPropertyName("id")>]
        Id : HeadId
        [<JsonPropertyName("name")>]
        Name : string
        [<JsonPropertyName("commit")>]
        Commit : Commit
        [<JsonPropertyName("permissions")>]
        Permissions : Permissions
        [<JsonPropertyName("type")>]
        Type : HeadType
    }

    static member CreateDocumentKey(id: HeadId): DocumentKey =
        DocumentKey.Create(id.Value, HeadType.Instance.Value)
    member private this.DocKey = Head.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key


