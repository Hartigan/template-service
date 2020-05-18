namespace DatabaseTypes

open System
open System.Text.Json.Serialization
open DatabaseTypes.Identificators
open Utils
open Utils.Converters

[<JsonConverter(typeof<CommitTypeConverter>)>]
type CommitType private () =
    inherit BaseType("commit")
    static member Instance = CommitType()
and CommitTypeConverter() =
    inherit StringConverter<CommitType>((fun m -> m.Value), (fun _ -> CommitType.Instance))

type Target =
    {
        [<JsonPropertyName("id")>]
        Id : TargetId
        [<JsonPropertyName("type")>]
        Type : string
    }

type Commit =
    {
        [<JsonPropertyName("id")>]
        Id : CommitId
        [<JsonPropertyName("head_id")>]
        HeadId : HeadId
        [<JsonPropertyName("author_id")>]
        AuthorId : UserId
        [<JsonPropertyName("target")>]
        Target : Target
        [<JsonPropertyName("timestamp")>]
        Timestamp : DateTimeOffset
        [<JsonPropertyName("parent_id")>]
        [<JsonConverter(typeof<OptionValueConverter<CommitId>>)>]
        ParentId : CommitId option
        [<JsonPropertyName("description")>]
        Description : string
        [<JsonPropertyName("type")>]
        Type : CommitType
    }

    static member CreateDocumentKey(id: CommitId): DocumentKey =
        DocumentKey.Create(id.Value, CommitType.Instance.Value)
    member private this.DocKey = Commit.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
