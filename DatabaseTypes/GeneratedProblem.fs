namespace DatabaseTypes

open System.Text.Json.Serialization

type GeneratedProblem =
    {
        [<JsonPropertyName("id")>]
        Id : string
        [<JsonPropertyName("problem_id")>]
        ProblemId : string
        [<JsonPropertyName("seed")>]
        Seed : int32
        [<JsonPropertyName("title")>]
        Title : string
        [<JsonPropertyName("view")>]
        View : Code
        [<JsonPropertyName("answer")>]
        Answer : string
    }

    static member TypeName = "generated_problem"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, GeneratedProblem.TypeName)
    member private this.DocKey = GeneratedProblem.CreateDocumentKey(this.Id)

    [<JsonPropertyName("type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()
    
    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
