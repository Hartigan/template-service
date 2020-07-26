namespace Services.Problems

open System
open DatabaseTypes
open Models.Problems
open DatabaseTypes.Identificators
open System.Net.Http
open System.Text.Json.Serialization
open Models.Code
open Utils.AsyncHelper
open System.Text.Json
open System.Text

type ValidateProblemAnswerRequest =
    {
        [<JsonPropertyName("problem_id")>]
        ProblemId: ProblemId
        [<JsonPropertyName("code")>]
        Code: ContentModel
        [<JsonPropertyName("expected_answer")>]
        Expected: ProblemAnswer
        [<JsonPropertyName("actual_answer")>]
        Actual: ProblemAnswer
    }

type ValidateProblemAnswerResponse =
    {
        [<JsonPropertyName("is_correct")>]
        IsCorrect: bool
    }

type ValidatorConnector(endpoint: string,
                        name: string,
                        clientFactory: IHttpClientFactory) =

    let httpClient =
        clientFactory.CreateClient("validator_" + name)
        |> fun x ->
            x.BaseAddress <- Uri(endpoint)
            x.DefaultRequestHeaders.Add("Accept", "application/json")
            x

    let jsonOptions =
        JsonSerializerOptions()
        |> fun x ->
            x.Converters.Add(JsonFSharpConverter())
            x
    
    member this.Validate(problem: ProblemModel, actual: ProblemAnswer, expected: ProblemAnswer) =
        let content = {
            ProblemId = problem.Id
            Code = problem.Validator.Content
            Actual = actual
            Expected = expected
        }

        let body = new StringContent(JsonSerializer.Serialize(content, jsonOptions),
                                     Encoding.UTF8,
                                     "application/json")
        async {
            let! (response: HttpResponseMessage) = httpClient.PostAsync("validate", body)

            if response.IsSuccessStatusCode then
                use! responseStream = response.Content.ReadAsStreamAsync()
                let! (generatedData: ValidateProblemAnswerResponse) =
                    JsonSerializer.DeserializeAsync<ValidateProblemAnswerResponse>(responseStream, jsonOptions)
                    |> fun x -> x.AsTask()
                return Ok(generatedData)
            else
                return Error(Exception(sprintf "Failed with status code"))
        }