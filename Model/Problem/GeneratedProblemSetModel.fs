namespace Models.Problems

open DatabaseTypes
open DatabaseTypes.Identificators
open Utils.Converters
open System.Text.Json.Serialization
open System


[<JsonConverter(typeof<ProblemSeedConverter>)>]
type ProblemSetSeed(seed: int32) =
    member val Value = seed with get

and ProblemSetSeedConverter() =
    inherit Int32Converter<ProblemSetSeed>((fun m -> m.Value),
                                        (fun i -> ProblemSetSeed(i)))

type GeneratedProblemSetModel =

    {
        [<JsonPropertyName("id")>]
        Id          : GeneratedProblemSetId
        [<JsonPropertyName("title")>]
        Title       : ProblemSetTitle
        [<JsonPropertyName("seed")>]
        Seed        : ProblemSetSeed
        [<JsonPropertyName("problems")>]
        Problems    : List<GeneratedProblemId>
        [<JsonPropertyName("duration")>]
        Duration    : TimeSpan
    }
    

    static member Create(generatedProblemSet: GeneratedProblemSet) : Result<GeneratedProblemSetModel, Exception> =
        Ok({
            Id          = generatedProblemSet.Id
            Title       = ProblemSetTitle(generatedProblemSet.Title)
            Seed        = ProblemSetSeed(generatedProblemSet.Seed)
            Problems    = generatedProblemSet.Problems
            Duration    = TimeSpan(0, 0, generatedProblemSet.Duration)
        })
