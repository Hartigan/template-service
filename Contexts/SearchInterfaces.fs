namespace Contexts

open DatabaseTypes
open System
open DatabaseTypes.Identificators
open System.Text.Json.Serialization

type SearchInterval<'T> =
    {
        [<JsonPropertyName("from")>]
        From : 'T
        [<JsonPropertyName("to")>]
        To : 'T
    }

type IReportSearch =
    abstract member Search : string option * UserId option * SearchInterval<DateTimeOffset> option * List<ReportId> * offset:UInt32 * limit:UInt32 -> Async<List<Report>>

type IHeadSearch =
    abstract member Search : string option * UserId option * List<string> * List<HeadId> * offset:UInt32 * limit:UInt32 -> Async<List<Head>>
    abstract member SearchPrivateProblemSets : string option * List<string> * UserId option * problemsCount:SearchInterval<uint32> option * duration:SearchInterval<int32> option * List<HeadId> * offset:UInt32 * limit:UInt32 -> Async<List<Head>>
    abstract member SearchPublicProblemSets : string option * List<string> * UserId option * problemsCount:SearchInterval<uint32> option * duration:SearchInterval<int32> option * offset:UInt32 * limit:UInt32 -> Async<List<Head>>
