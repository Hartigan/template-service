namespace Models.Heads

open DatabaseTypes
open Models.Identificators
open Models.Converters
open Models.Permissions
open System.Runtime.Serialization
open System.Text.Json.Serialization

[<JsonConverter(typeof<HeadNameConverter>)>]
type HeadName(name: string) =
    member val Value = name with get

and HeadNameConverter() =
    inherit StringConverter<HeadName>((fun m -> m.Value), (fun s -> HeadName(s)))

type HeadModel private (id: HeadId, name: HeadName, permissions: PermissionsModel, commit: CommitModel) =
    [<JsonPropertyName("id")>]
    member val Id       = id with get
    [<JsonPropertyName("name")>]
    member val Name     = name with get
    [<JsonPropertyName("permissions")>]
    member val Permissions  = permissions with get
    [<JsonPropertyName("commit")>]
    member val Commit   = commit with get
    
    static member Create(head: Head): Result<HeadModel, unit> =
        match CommitModel.Create(head.Commit) with
        | Result.Error() -> Result.Error()
        | Result.Ok(commitModel) ->
            Result.Ok(HeadModel(HeadId(head.Id),
                                HeadName(head.Name),
                                PermissionsModel(head.Permissions),
                                commitModel))
     