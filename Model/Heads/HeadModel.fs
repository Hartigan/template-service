namespace Models.Heads

open DatabaseTypes
open DatabaseTypes.Identificators
open Utils.Converters
open Models.Permissions
open System.Text.Json.Serialization
open System

[<JsonConverter(typeof<HeadNameConverter>)>]
type HeadName(name: string) =
    member val Value = name with get

and HeadNameConverter() =
    inherit StringConverter<HeadName>((fun m -> m.Value), (fun s -> HeadName(s)))

type HeadModel private (id: HeadId, name: HeadName, commit: CommitModel) =
    [<JsonPropertyName("id")>]
    member val Id       = id with get
    [<JsonPropertyName("name")>]
    member val Name     = name with get
    [<JsonPropertyName("commit")>]
    member val Commit   = commit with get
    
    static member Create(head: Head): Result<HeadModel, Exception> =
        match CommitModel.Create(head.Commit) with
        | Error(ex) -> Error(InvalidOperationException("cannot create HeadModel", ex) :> Exception)
        | Ok(commitModel) ->
            Ok(HeadModel(HeadId(head.Id),
                         HeadName(head.Name),
                         commitModel))
     