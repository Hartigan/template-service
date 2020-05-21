namespace Models.Trash

open System
open DatabaseTypes
open DatabaseTypes.Identificators
open Models.Heads
open Models.Permissions
open Utils.Converters
open System.Text.Json.Serialization
open Utils.ResultHelper
open Models.Folders


type TrashHeadEntryModel =
    {
        [<JsonPropertyName("head_id")>]
        HeadId      : HeadId
        [<JsonPropertyName("name")>]
        Name        : HeadName
        [<JsonPropertyName("type")>]
        Type        : ModelType
    }

    static member Create(head: Head) : Result<TrashHeadEntryModel, Exception> =
        match ModelTypeConverter.Create(head.Commit.Target.Type) with
        | Ok(modelType) ->
            Ok({
                HeadId              = head.Id
                Name                = HeadName(head.Name)
                Type                = modelType
            })
        | Error(ex) -> Error(InvalidOperationException("cannot create TrashHeadEntryModel", ex) :> Exception)

type TrashFolderEntryModel =
    {
        [<JsonPropertyName("folder_id")>]
        FolderId    : FolderId
        [<JsonPropertyName("name")>]
        Name        : FolderName
    }

    static member Create(folder: Folder) : TrashFolderEntryModel =
        {
            FolderId    = folder.Id
            Name        = FolderName(folder.Name)
        }

        
type TrashModel = 
    {
        [<JsonPropertyName("heads")>]
        Heads       : List<TrashHeadEntryModel>
        [<JsonPropertyName("folders")>]
        Folders     : List<TrashFolderEntryModel>
    }

    static member Create(heads: List<TrashHeadEntryModel>,
                         folders: List<TrashFolderEntryModel>) : TrashModel =
        {
            Heads       = heads
            Folders     = folders
        }
