namespace Models.Problems

open DatabaseTypes
open Models.Identificators
open Models.Converters
open Models.Code
open System.Runtime.Serialization
open System.Text.Json.Serialization

[<JsonConverter(typeof<ProblemSeedConverter>)>]
type ProblemSeed(seed: int32) =
    member val Value = seed with get

and ProblemSeedConverter() =
    inherit Int32Converter<ProblemSeed>((fun m -> m.Value),
                                        (fun i -> ProblemSeed(i)))

[<JsonConverter(typeof<ProblemAnswerConverter>)>]
type ProblemAnswer(ans: string) =
    member val Value = ans with get

and ProblemAnswerConverter() =
    inherit StringConverter<ProblemAnswer>((fun m -> m.Value),
                                           (fun i -> ProblemAnswer(i)))

type GeneratedProblemModel private (id: GeneratedProblemId,
                                    problemId: ProblemId,
                                    seed: ProblemSeed,
                                    title: ProblemTitle,
                                    view: GeneratedViewModel,
                                    answer: ProblemAnswer) =
    [<JsonPropertyName("id")>]
    member val Id           = id with get
    [<JsonPropertyName("problem_id")>]
    member val ProblemId    = problemId with get
    [<JsonPropertyName("seed")>]
    member val Seed         = seed with get
    [<JsonPropertyName("title")>]
    member val Title        = title with get
    [<JsonPropertyName("view")>]
    member val View         = view with get
    [<JsonPropertyName("answer")>]
    member val Answer       = answer with get

    static member Create(generatedProblem: GeneratedProblem) : Result<GeneratedProblemModel, unit> =
        let codes = (CodeModel.Create(generatedProblem.View))
        match codes with
        | (Ok(viewCode)) ->
            let codeModels = (GeneratedViewModel.Create(viewCode))
            match codeModels with
            | (Ok(viewModel)) ->
                Ok(GeneratedProblemModel(GeneratedProblemId(generatedProblem.Id),
                                         ProblemId(generatedProblem.ProblemId),
                                         ProblemSeed(generatedProblem.Seed),
                                         ProblemTitle(generatedProblem.Title),
                                         viewModel,
                                         ProblemAnswer(generatedProblem.Answer)))
            | _ -> Error()
        | _ -> Error()