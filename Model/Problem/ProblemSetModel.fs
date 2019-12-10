namespace Models.Problems

open DatabaseTypes
open Models.Identificators
open Models.Converters
open System.Runtime.Serialization
open System.Text.Json.Serialization
open System.Collections.Generic
open System.Linq

type ProblemSetTitle(title: string) =
    member val Value = title with get

type ProblemSetTitleConverter() =
    inherit StringConverter<ProblemSetTitle>((fun m -> m.Value),
                                             (fun s -> ProblemSetTitle(s)))

type ProblemSetModel private (id: ProblemSetId,
                              title: ProblemSetTitle,
                              headIds: List<HeadId>) =
    [<DataMember(Name = "id")>]
    [<JsonConverter(typeof<ProblemSetIdConverter>)>]
    member val Id           = id with get
    [<DataMember(Name = "title")>]
    [<JsonConverter(typeof<ProblemSetTitleConverter>)>]
    member val Title        = title with get
    [<DataMember(Name = "head_ids")>]
    member val Heads        = headIds with get

    static member Create(problemSet: ProblemSet) : Result<ProblemSetModel, unit> =
        Ok(ProblemSetModel(ProblemSetId(problemSet.Id),
                           ProblemSetTitle(problemSet.Title),
                           problemSet.Heads.Select(fun x -> HeadId(x)).ToList()))