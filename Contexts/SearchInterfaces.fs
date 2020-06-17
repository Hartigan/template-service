namespace Contexts

open DatabaseTypes
open System
open DatabaseTypes.Identificators

type IReportSearch =
    abstract member Search : string option * UserId option * List<ReportId> * offset:UInt32 * limit:UInt32 -> Async<List<Report>>

type IHeadSearch =
    abstract member Search : string option * UserId option * List<string> * List<HeadId> * offset:UInt32 * limit:UInt32 -> Async<List<Head>>
    abstract member SearchProblemSets : string option * List<string> * List<HeadId> * offset:UInt32 * limit:UInt32 -> Async<List<Head>>
    