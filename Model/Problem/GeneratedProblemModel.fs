namespace Models.Problems

open DatabaseTypes
open DatabaseTypes.Identificators
open Utils.Converters
open Models.Code
open System.Text.Json.Serialization
open System

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

type GeneratedProblemModel =
    {
        [<JsonPropertyName("id")>]
        Id              : GeneratedProblemId
        [<JsonPropertyName("problem_id")>]
        ProblemId       : ProblemId
        [<JsonPropertyName("seed")>]
        Seed            : ProblemSeed
        [<JsonPropertyName("title")>]
        Title           : ProblemTitle
        [<JsonPropertyName("view")>]
        View            : GeneratedViewModel
        [<JsonPropertyName("answer")>]
        Answer          : ProblemAnswer
    }
    

    static member Create(generatedProblem: GeneratedProblem) : Result<GeneratedProblemModel, Exception> =
        let codes = CodeModel.Create(generatedProblem.View)
        match codes with
        | Ok(viewCode) ->
            let codeModels = GeneratedViewModel.Create(viewCode)
            match codeModels with
            | Ok(viewModel) ->
                Ok({
                    Id          = generatedProblem.Id
                    ProblemId   = generatedProblem.ProblemId
                    Seed        = ProblemSeed(generatedProblem.Seed)
                    Title       = ProblemTitle(generatedProblem.Title)
                    View        = viewModel
                    Answer      = ProblemAnswer(generatedProblem.Answer)
                })
            | Error(ex) -> Error(InvalidOperationException("cannot create GeneratedProblemModel", ex) :> Exception)
        | Error(ex) -> Error(InvalidOperationException("cannot create GeneratedProblemModel", ex) :> Exception)