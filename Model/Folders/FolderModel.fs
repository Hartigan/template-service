namespace Models.Folders

open System
open DatabaseTypes
open DatabaseTypes.Identificators
open Models.Heads
open Models.Permissions
open Utils.Converters
open System.Text.Json.Serialization
open Utils.ResultHelper

[<JsonConverter(typeof<FolderNameConverter>)>]
type FolderName(name: string) =
    member val Value = name with get

and FolderNameConverter() =
    inherit StringConverter<FolderName>((fun m -> m.Value), (fun s -> FolderName(s)))

type FolderLinkModel =
    {
        [<JsonPropertyName("id")>]
        Id       : FolderId
        [<JsonPropertyName("name")>]
        Name     : FolderName
    }

    static member Create(link: FolderLink) : Result<FolderLinkModel, Exception> =
        Ok({
            FolderLinkModel.Id      = FolderId(link.Id)
            Name                    = FolderName(link.Name)
        })


type HeadLinkModel = 
    {
        [<JsonPropertyName("id")>]
        Id       : HeadId
        [<JsonPropertyName("name")>]
        Name     : HeadName
        [<JsonPropertyName("type")>]
        Type     : ModelType
    }

    static member Create(link: HeadLink) : Result<HeadLinkModel, Exception> =
        match ModelTypeConverter.Create(link.Type) with
        | Ok(modelType) ->
            Ok({
                HeadLinkModel.Id    = HeadId(link.Id)
                Name                = HeadName(link.Name)
                Type                = modelType
            })
        | Error(ex) -> Error(InvalidOperationException("cannot create HeadLinkModel", ex) :> Exception)

type FolderModel =
    {
        [<JsonPropertyName("id")>]
        Id           : FolderId
        [<JsonPropertyName("name")>]
        Name         : FolderName
        [<JsonPropertyName("folders")>]
        Folders      : List<FolderLinkModel>
        [<JsonPropertyName("heads")>]
        Heads        : List<HeadLinkModel>
    }

    static member Create(folder: Folder) : Result<FolderModel, Exception> =
        let folderLinks =
            folder.Folders
            |> Seq.map FolderLinkModel.Create
            |> ResultOfSeq

        let headLinks =
            folder.Heads
            |> Seq.map HeadLinkModel.Create
            |> ResultOfSeq

        match (folderLinks, headLinks) with
        | (Ok(folders), Ok(heads)) ->
            Ok({
                FolderModel.Id      = FolderId(folder.Id)
                Name                = FolderName(folder.Name)
                Folders             = folders
                Heads               = heads
            })
        | errors -> Error(ErrorOf2 errors)