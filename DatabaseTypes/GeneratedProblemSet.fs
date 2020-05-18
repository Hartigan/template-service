namespace DatabaseTypes

open System.Text.Json.Serialization
open DatabaseTypes.Identificators
open Utils.Converters

[<JsonConverter(typeof<GeneratedProblemSetTypeConverter>)>]
type GeneratedProblemSetType private () =
    inherit BaseType("generated_problem_set")
    static member Instance = GeneratedProblemSetType()
and GeneratedProblemSetTypeConverter() =
    inherit StringConverter<GeneratedProblemSetType>((fun m -> m.Value), (fun _ -> GeneratedProblemSetType.Instance))

type GeneratedProblemSet =
    {
        [<JsonPropertyName("id")>]
        Id : GeneratedProblemSetId
        [<JsonPropertyName("problems")>]
        Problems : List<GeneratedProblemId>
        [<JsonPropertyName("title")>]
        Title : string
        [<JsonPropertyName("view")>]
        Duration : int32
        [<JsonPropertyName("type")>]
        Type : GeneratedProblemSetType
    }

    static member CreateDocumentKey(id: GeneratedProblemSetId): DocumentKey =
        DocumentKey.Create(id.Value, GeneratedProblemSetType.Instance.Value)
    member private this.DocKey = GeneratedProblemSet.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
