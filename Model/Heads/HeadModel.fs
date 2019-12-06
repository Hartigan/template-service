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

type HeadModel private (id: HeadId, name: HeadName, permissions: PermissionsModel, commit: CommitModel) =
    [<DataMember(Name = "id")>]
    [<JsonConverter(typeof<HeadIdConverter>)>]
    member val Id       = id with get
    [<DataMember(Name = "name")>]
    [<JsonConverter(typeof<HeadNameConverter>)>]
    member val Name     = name with get
    [<DataMember(Name = "permissions")>]
    member val Permissions  = permissions with get
    [<DataMember(Name = "commit")>]
    member val Commit   = commit with get
    
    static member Create(head: Head): Result<HeadModel, unit> =
        match CommitModel.Create(head.Commit) with
        | Result.Error() -> Result.Error()
        | Result.Ok(commitModel) ->
            Result.Ok(HeadModel(HeadId(head.Id),
                                HeadName(head.Name),
                                PermissionsModel(head.Permissions),
                                commitModel))
     