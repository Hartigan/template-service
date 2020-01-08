namespace Models.Folders

open System
open DatabaseTypes
open Models.Identificators
open Models.Heads
open Models.Permissions
open Models.Converters
open System.Runtime.Serialization
open System.Text.Json.Serialization

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

    static member Create(link: FolderLink) : Result<FolderLinkModel, unit> =
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

    static member Create(link: HeadLink) : Result<HeadLinkModel, unit> =
        match ModelTypeConverter.Create(link.Type) with
        | Ok(modelType) ->
            Ok({
                HeadLinkModel.Id    = HeadId(link.Id)
                Name                = HeadName(link.Name)
                Type                = modelType
            })
        | Result.Error() -> Result.Error()

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
        [<JsonPropertyName("permissions")>]
        Permissions  : PermissionsModel
    }

    static member Create(folder: Folder) : Result<FolderModel, unit> =
        let folderLinks =
            folder.Folders
            |> Seq.map(fun x ->
                match FolderLinkModel.Create x with
                | Ok(model) -> Ok([ model ])
                | Result.Error() -> Result.Error()
            )
            |> Seq.fold (fun r x ->
                match (r, x) with
                | (Ok(l), Ok(r)) -> Ok(l @ r)
                | _ -> Result.Error()) (Result<List<FolderLinkModel>, unit>.Ok([]))
            

        let headLinks =
            folder.Heads
            |> Seq.map(fun x ->
                match HeadLinkModel.Create x with
                | Ok(model) -> Ok([ model ])
                | Error() -> Error()
            )
            |> Seq.fold (fun r x ->
                match (r, x) with
                | (Ok(l), Ok(r)) -> Ok(l @ r)
                | _ -> Result.Error()) (Result<List<HeadLinkModel>, unit>.Ok([]))

        match (folderLinks, headLinks) with
        | (Ok(folders), Ok(heads)) ->
            Ok({
                FolderModel.Id      = FolderId(folder.Id)
                Name                = FolderName(folder.Name)
                Permissions         = PermissionsModel(folder.Permissions)
                Folders             = folders
                Heads               = heads
            })
        | _ -> Result.Error()