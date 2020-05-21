namespace DatabaseTypes

open System.Text.Json.Serialization
open DatabaseTypes.Identificators
open Utils.Converters

[<JsonConverter(typeof<TrashTypeConverter>)>]
type TrashType private () =
    inherit BaseType("trash")
    static member Instance = TrashType()
and TrashTypeConverter() =
    inherit StringConverter<TrashType>((fun m -> m.Value), (fun _ -> TrashType.Instance))

type TrashHeadEntry =
    {
        [<JsonPropertyName("parent_id")>]
        ParentId    : FolderId
        [<JsonPropertyName("head_id")>]
        HeadId      : HeadId
    }

type TrashFolderEntry =
    {
        [<JsonPropertyName("parent_id")>]
        ParentId    : FolderId
        [<JsonPropertyName("folder_id")>]
        FolderId    : FolderId
    }

type Trash =
    {
        [<JsonPropertyName("owner_id")>]
        OwnerId : UserId
        [<JsonPropertyName("heads")>]
        Heads : List<TrashHeadEntry>
        [<JsonPropertyName("folders")>]
        Folders : List<TrashFolderEntry>
        [<JsonPropertyName("type")>]
        Type : TrashType
    }

    static member CreateDocumentKey(id: UserId): DocumentKey =
        DocumentKey.Create(id.Value, TrashType.Instance.Value)
    member private this.DocKey = Trash.CreateDocumentKey(this.OwnerId)

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key

