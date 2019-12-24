namespace Models.Folders

open System
open System.Linq
open System.Collections.Generic
open DatabaseTypes
open Models.Identificators
open Models.Heads
open Models.Permissions
open Models.Converters
open System.Runtime.Serialization
open System.Text.Json.Serialization

[<JsonConverter(typeof<FolderNameConverter>)>]
type FolderName(name: string) =
    member val Name = name with get

and FolderNameConverter() =
    inherit StringConverter<FolderName>((fun m -> m.Name), (fun s -> FolderName(s)))

type FolderLinkModel(link: FolderLink) =
    [<JsonPropertyName("id")>]
    member val Id       = FolderId(link.Id) with get
    [<JsonPropertyName("name")>]
    member val Name     = FolderName(link.Name) with get

type HeadLinkModel(link: HeadLink) =
    [<JsonPropertyName("id")>]
    member val Id       = HeadId(link.Id) with get

    [<JsonPropertyName("name")>]
    member val Name     = HeadName(link.Name) with get

type FolderModel(folder: Folder) =
    [<JsonPropertyName("id")>]
    member val Id           = FolderId(folder.Id) with get
    [<JsonPropertyName("name")>]
    member val Name         = FolderName(folder.Name) with get
    [<JsonPropertyName("folders")>]
    member val Folders      = folder.Folders.Select(fun x -> FolderLinkModel(x)).ToList() :> IReadOnlyList<FolderLinkModel> with get
    [<JsonPropertyName("heads")>]
    member val Heads        = folder.Heads.Select(fun x -> HeadLinkModel(x)).ToList() :> IReadOnlyList<HeadLinkModel> with get
    [<JsonPropertyName("permissions")>]
    member val Permissions  = PermissionsModel(folder.Permissions) with get
