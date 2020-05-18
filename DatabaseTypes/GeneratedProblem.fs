namespace DatabaseTypes

open System.Text.Json.Serialization
open DatabaseTypes.Identificators
open Utils.Converters

[<JsonConverter(typeof<GeneratedProblemTypeConverter>)>]
type GeneratedProblemType private () =
    inherit BaseType("generated_problem")
    static member Instance = GeneratedProblemType()
and GeneratedProblemTypeConverter() =
    inherit StringConverter<GeneratedProblemType>((fun m -> m.Value), (fun _ -> GeneratedProblemType.Instance))

type GeneratedProblem =
    {
        [<JsonPropertyName("id")>]
        Id : GeneratedProblemId
        [<JsonPropertyName("problem_id")>]
        ProblemId : ProblemId
        [<JsonPropertyName("seed")>]
        Seed : int32
        [<JsonPropertyName("title")>]
        Title : string
        [<JsonPropertyName("view")>]
        View : Code
        [<JsonPropertyName("answer")>]
        Answer : string
        [<JsonPropertyName("type")>]
        Type : GeneratedProblemType
    }

    static member CreateDocumentKey(id: GeneratedProblemId): DocumentKey =
        DocumentKey.Create(id.Value, GeneratedProblemType.Instance.Value)
    member private this.DocKey = GeneratedProblem.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
