namespace Models.Problems

open DatabaseTypes
open DatabaseTypes.Identificators
open Utils.Converters
open System.Text.Json.Serialization
open System


type GeneratedProblemSetModel =

    {
        [<JsonPropertyName("id")>]
        Id          : GeneratedProblemSetId
        [<JsonPropertyName("title")>]
        Title       : ProblemSetTitle
        [<JsonPropertyName("problems")>]
        Problems    : List<GeneratedProblemId>
        [<JsonPropertyName("duration")>]
        Duration    : TimeSpan
    }
    

    static member Create(generatedProblemSet: GeneratedProblemSet) : Result<GeneratedProblemSetModel, Exception> =
        Ok({
            Id          = generatedProblemSet.Id
            Title       = ProblemSetTitle(generatedProblemSet.Title)
            Problems    = generatedProblemSet.Problems
            Duration    = TimeSpan(0, 0, generatedProblemSet.Duration)
        })
