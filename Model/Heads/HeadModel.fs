namespace Models.Heads

open DatabaseTypes
open Models.Identificators
open Models.Converters
open Models.Permissions
open System.Runtime.Serialization
open System.Text.Json.Serialization

type HeadName(name: string) =
    member val Name = name with get

type HeadNameConverter() =
    inherit StringConverter<HeadName>((fun m -> m.Name), (fun s -> HeadName(s)))

type HeadModel(head: Head) =
    [<DataMember(Name = "id")>]
    [<JsonConverter(typeof<HeadIdConverter>)>]
    member val Id       = HeadId(head.Id) with get
    [<DataMember(Name = "name")>]
    [<JsonConverter(typeof<HeadNameConverter>)>]
    member val Name     = HeadName(head.Name) with get
    [<DataMember(Name = "permissions")>]
    member val Permissions  = PermissionsModel(head.Permissions) with get