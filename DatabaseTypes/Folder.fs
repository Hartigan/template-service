namespace DatabaseTypes

open System.Text.Json.Serialization
open DatabaseTypes.Identificators
open Utils.Converters

[<JsonConverter(typeof<FolderTypeConverter>)>]
type FolderType private () =
    inherit BaseType("folder")
    static member Instance = FolderType()
and FolderTypeConverter() =
    inherit StringConverter<FolderType>((fun m -> m.Value), (fun _ -> FolderType.Instance))


type FolderLink = {
    [<JsonPropertyName("id")>]
    Id : FolderId
    [<JsonPropertyName("name")>]
    Name : string
}

type HeadLink = {
    [<JsonPropertyName("id")>]
    Id : HeadId
    [<JsonPropertyName("name")>]
    Name : string
    [<JsonPropertyName("type")>]
    Type: string
}

type Folder =
    {
        [<JsonPropertyName("id")>]
        Id : FolderId
        [<JsonPropertyName("name")>]
        Name : string
        [<JsonPropertyName("permissions")>]
        Permissions : Permissions
        [<JsonPropertyName("folders")>]
        Folders : List<FolderLink>
        [<JsonPropertyName("heads")>]
        Heads : List<HeadLink>
        [<JsonPropertyName("type")>]
        Type : FolderType
    }

    static member CreateDocumentKey(id: FolderId): DocumentKey =
        DocumentKey.Create(id.Value, FolderType.Instance.Value)
    member private this.DocKey = Folder.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key

