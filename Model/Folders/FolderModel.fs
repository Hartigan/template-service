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

type FolderName(name: string) =
    member val Name = name with get

type FolderNameConverter() =
    inherit StringConverter<FolderName>((fun m -> m.Name), (fun s -> FolderName(s)))

[<DataContract>]
type FolderLinkModel(link: FolderLink) =
    [<DataMember(Name = "id")>]
    [<JsonConverter(typeof<FolderIdConverter>)>]
    member val Id       = FolderId(link.Id) with get
    [<DataMember(Name = "name")>]
    [<JsonConverter(typeof<FolderNameConverter>)>]
    member val Name     = FolderName(link.Name) with get

type HeadLinkModel(link: HeadLink) =
    [<DataMember(Name = "id")>]
    [<JsonConverter(typeof<HeadIdConverter>)>]
    member val Id       = HeadId(link.Id) with get

    [<DataMember(Name = "name")>]
    [<JsonConverter(typeof<HeadNameConverter>)>]
    member val Name     = HeadName(link.Name) with get

type FolderModel(folder: Folder) =
    [<DataMember(Name = "id")>]
    [<JsonConverter(typeof<FolderIdConverter>)>]
    member val Id           = FolderId(folder.Id) with get
    [<DataMember(Name = "name")>]
    [<JsonConverter(typeof<FolderNameConverter>)>]
    member val Name         = FolderName(folder.Name) with get
    [<DataMember(Name = "folders")>]
    member val Folders      = folder.Folders.Select(fun x -> FolderLinkModel(x)).ToList() :> IReadOnlyList<FolderLinkModel> with get
    [<DataMember(Name = "heads")>]
    member val Heads        = folder.Heads.Select(fun x -> HeadLinkModel(x)).ToList() :> IReadOnlyList<HeadLinkModel> with get
    [<DataMember(Name = "permissions")>]
    member val Permissions  = PermissionsModel(folder.Permissions) with get
