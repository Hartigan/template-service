namespace CSharpGenerator

open System.Text.Json.Serialization

type GenerateProblemDataRequest =
    {
        [<JsonPropertyName("problem_id")>]
        ProblemId: string
        [<JsonPropertyName("code")>]
        Code: string
        [<JsonPropertyName("seed")>]
        Seed: int32
    }

type ProblemParameter =
    {
        [<JsonPropertyName("name")>]
        Name: string
        [<JsonPropertyName("value")>]
        Value: string
    }

type GenerateProblemDataResponse =
    {
        [<JsonPropertyName("parameters")>]
        Parameters: List<ProblemParameter>
        [<JsonPropertyName("answer")>]
        Answer: string
    }

type ValidateProblemAnswerRequest =
    {
        [<JsonPropertyName("problem_id")>]
        ProblemId: string
        [<JsonPropertyName("code")>]
        Code: string
        [<JsonPropertyName("expected_answer")>]
        Expected: string
        [<JsonPropertyName("actual_answer")>]
        Actual: string
    }

type ValidateProblemAnswerResponse =
    {
        [<JsonPropertyName("is_correct")>]
        IsCorrect: bool
    }

