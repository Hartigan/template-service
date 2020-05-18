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

type HeadModel =
    {
        [<JsonPropertyName("id")>]
        Id      : HeadId
        [<JsonPropertyName("name")>]
        Name    : HeadName
        [<JsonPropertyName("commit")>]
        Commit  : CommitModel
    }
    
    
    static member Create(head: Head): Result<HeadModel, Exception> =
        match CommitModel.Create(head.Commit) with
        | Error(ex) -> Error(InvalidOperationException("cannot create HeadModel", ex) :> Exception)
        | Ok(commitModel) ->
            Ok({
                Id      = head.Id
                Name    = HeadName(head.Name)
                Commit  = commitModel
            })
     