namespace Models.Problems

open DatabaseTypes
open Models.Identificators
open Models.Converters
open Models.Code
open System.Runtime.Serialization
open System.Text.Json.Serialization

type ProblemSeed(seed: int32) =
    member val Value = seed with get

type ProblemSeedConverter() =
    inherit Int32Converter<ProblemSeed>((fun m -> m.Value),
                                        (fun i -> ProblemSeed(i)))

type ProblemAnswer(ans: string) =
    member val Value = ans with get

type ProblemAnswerConverter() =
    inherit StringConverter<ProblemAnswer>((fun m -> m.Value),
                                           (fun i -> ProblemAnswer(i)))

type GeneratedProblemModel private (id: GeneratedProblemId,
                                    problemId: ProblemId,
                                    seed: ProblemSeed,
                                    title: ProblemTitle,
                                    view: GeneratedViewModel,
                                    answer: ProblemAnswer) =
    [<DataMember(Name = "id")>]
    [<JsonConverter(typeof<GeneratedProblemIdConverter>)>]
    member val Id           = id with get
    [<DataMember(Name = "problem_id")>]
    [<JsonConverter(typeof<ProblemIdConverter>)>]
    member val ProblemId    = problemId with get
    [<DataMember(Name = "seed")>]
    [<JsonConverter(typeof<ProblemSeedConverter>)>]
    member val Seed         = seed with get
    [<DataMember(Name = "title")>]
    [<JsonConverter(typeof<ProblemTitleConverter>)>]
    member val Title        = title with get
    [<DataMember(Name = "view")>]
    member val View         = view with get
    [<DataMember(Name = "answer")>]
    [<JsonConverter(typeof<ProblemAnswerConverter>)>]
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