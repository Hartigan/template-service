namespace DatabaseTypes

open System.Text.Json.Serialization
open DatabaseTypes.Identificators
open Utils.Converters

[<JsonConverter(typeof<ProblemSetTypeConverter>)>]
type ProblemSetType private () =
    inherit BaseType("problem_set")
    static member Instance = ProblemSetType()
and ProblemSetTypeConverter() =
    inherit StringConverter<ProblemSetType>((fun m -> m.Value), (fun _ -> ProblemSetType.Instance))

type ProblemSet =
    {
        [<JsonPropertyName("id")>]
        Id : ProblemSetId
        [<JsonPropertyName("title")>]
        Title : string
        [<JsonPropertyName("head_ids")>]
        Heads : List<HeadId>
        [<JsonPropertyName("duration")>]
        Duration : int32
        [<JsonPropertyName("type")>]
        Type : ProblemSetType
    }

    static member CreateDocumentKey(id: ProblemSetId): DocumentKey =
        DocumentKey.Create(id.Value, ProblemSetType.Instance.Value)
    member private this.DocKey = ProblemSet.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
