namespace Models.Problems

open DatabaseTypes
open Models.Identificators
open Models.Converters
open System.Runtime.Serialization
open System.Text.Json.Serialization
open System.Collections.Generic
open System.Linq
open System

[<JsonConverter(typeof<ProblemSetTitleConverter>)>]
type ProblemSetTitle(title: string) =
    member val Value = title with get

and ProblemSetTitleConverter() =
    inherit StringConverter<ProblemSetTitle>((fun m -> m.Value),
                                             (fun s -> ProblemSetTitle(s)))

type ProblemSetModel private (id: ProblemSetId,
                              title: ProblemSetTitle,
                              headIds: List<HeadId>,
                              duration: TimeSpan) =
    [<JsonPropertyName("id")>]
    member val Id           = id with get
    [<JsonPropertyName("title")>]
    member val Title        = title with get
    [<JsonPropertyName("head_ids")>]
    member val Heads        = headIds with get
    [<JsonPropertyName("duration")>]
    member val Duration     = duration with get

    static member Create(problemSet: ProblemSet) : Result<ProblemSetModel, unit> =
        Ok(ProblemSetModel(ProblemSetId(problemSet.Id),
                           ProblemSetTitle(problemSet.Title),
                           problemSet.Heads.Select(fun x -> HeadId(x)).ToList(),
                           TimeSpan(0, 0, problemSet.Duration)))