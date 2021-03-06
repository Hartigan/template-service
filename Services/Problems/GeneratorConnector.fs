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

type GenerateProblemDataRequest =
    {
        [<JsonPropertyName("problem_id")>]
        ProblemId: ProblemId
        [<JsonPropertyName("code")>]
        Code: ContentModel
        [<JsonPropertyName("seed")>]
        Seed: ProblemSeed
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
        Answer: ProblemAnswer
    }

type GeneratorConnector(endpoint: string,
                        name: string,
                        clientFactory: IHttpClientFactory) =

    let httpClient =
        clientFactory.CreateClient("generator_" + name)
        |> fun x ->
            x.BaseAddress <- Uri(endpoint)
            x.DefaultRequestHeaders.Add("Accept", "application/json")
            x

    let jsonOptions =
        JsonSerializerOptions()
        |> fun x ->
            x.Converters.Add(JsonFSharpConverter())
            x
    
    member this.Generate(problem: ProblemModel, seed: ProblemSeed) =
        async {
            let content = {
                ProblemId = problem.Id
                Code = problem.Controller.Content
                Seed = seed
            }

            let body = new StringContent(JsonSerializer.Serialize(content, jsonOptions),
                                     Encoding.UTF8,
                                     "application/json")

            let! (response: HttpResponseMessage) = httpClient.PostAsync("generate", body)

            if response.IsSuccessStatusCode then
                use! responseStream = response.Content.ReadAsStreamAsync()
                let! (generatedData: GenerateProblemDataResponse) =
                    JsonSerializer.DeserializeAsync<GenerateProblemDataResponse>(responseStream, jsonOptions)
                    |> fun x -> x.AsTask()
                return Ok(generatedData)
            else
                return Error(Exception(sprintf "Failed with status code"))
        }
