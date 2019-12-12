namespace Models.Problems

open DatabaseTypes
open Models.Identificators
open Models.Converters
open System.Runtime.Serialization
open System.Text.Json.Serialization
open System.Collections.Generic
open System.Linq
open System


type GeneratedProblemSetModel private (id: GeneratedProblemSetId,
                                       title: ProblemSetTitle,
                                       problems: List<GeneratedProblemId>,
                                       duration: TimeSpan) =
    [<DataMember(Name = "id")>]
    member val Id           = id with get
    [<DataMember(Name = "title")>]
    member val Title        = title with get
    [<DataMember(Name = "problems")>]
    member val Problems     = problems with get
    [<DataMember(Name = "duration")>]
    member val Duration     = duration with get

    static member Create(generatedProblemSet: GeneratedProblemSet) : Result<GeneratedProblemSetModel, unit> =
        Ok(GeneratedProblemSetModel(GeneratedProblemSetId(generatedProblemSet.Id),
                                    ProblemSetTitle(generatedProblemSet.Title),
                                    generatedProblemSet.Problems.Select(fun x -> GeneratedProblemId(x)).ToList(),
                                    TimeSpan(0, 0, generatedProblemSet.Duration)))