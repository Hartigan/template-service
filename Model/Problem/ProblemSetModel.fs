namespace Models.Problems

open DatabaseTypes
open DatabaseTypes.Identificators
open Utils.Converters
open System.Text.Json.Serialization
open System

[<JsonConverter(typeof<ProblemSetTitleConverter>)>]
type ProblemSetTitle(title: string) =
    member val Value = title with get

and ProblemSetTitleConverter() =
    inherit StringConverter<ProblemSetTitle>((fun m -> m.Value),
                                             (fun s -> ProblemSetTitle(s)))

[<JsonConverter(typeof<DurationModelConverter>)>]
type DurationModel(duration: TimeSpan) =
    member val Value = duration with get

and DurationModelConverter() =
    inherit UInt32Converter<DurationModel>((fun m -> Convert.ToUInt32(m.Value.TotalSeconds)),
                                           (fun u -> DurationModel(TimeSpan.FromSeconds(Convert.ToDouble(u)))))

type ProblemSetModel =
    {
        [<JsonPropertyName("id")>]
        Id          : ProblemSetId
        [<JsonPropertyName("title")>]
        Title       : ProblemSetTitle
        [<JsonPropertyName("head_ids")>]
        Heads       : List<HeadId>
        [<JsonPropertyName("duration")>]
        Duration    : DurationModel
    }
    static member Create(problemSet: ProblemSet) : Result<ProblemSetModel, Exception> =
        Ok({
            ProblemSetModel.Id      = problemSet.Id
            Title                   = ProblemSetTitle(problemSet.Title)
            Heads                   = problemSet.Heads
            Duration                = DurationModel(TimeSpan.FromSeconds(Convert.ToDouble(problemSet.Duration)))
        })
