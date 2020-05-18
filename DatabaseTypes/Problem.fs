namespace DatabaseTypes

open System.Text.Json.Serialization
open DatabaseTypes.Identificators
open Utils.Converters

[<JsonConverter(typeof<ProblemTypeConverter>)>]
type ProblemType private () =
    inherit BaseType("problem")
    static member Instance = ProblemType()
and ProblemTypeConverter() =
    inherit StringConverter<ProblemType>((fun m -> m.Value), (fun _ -> ProblemType.Instance))

type Problem =
    {
        [<JsonPropertyName("id")>]
        Id : ProblemId
        [<JsonPropertyName("title")>]
        Title : string
        [<JsonPropertyName("view")>]
        View : Code
        [<JsonPropertyName("controller")>]
        Controller : Code
        [<JsonPropertyName("validator")>]
        Validator : Code
        [<JsonPropertyName("type")>]
        Type : ProblemType
    }

    static member CreateDocumentKey(id: ProblemId): DocumentKey =
        DocumentKey.Create(id.Value, ProblemType.Instance.Value)
    member private this.DocKey = Problem.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
