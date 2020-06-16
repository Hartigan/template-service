namespace Contexts

open DatabaseTypes
open System
open DatabaseTypes.Identificators

type IReportSearch =
    abstract member Search : string option * UserId option * List<ReportId> * offset:UInt32 * limit:UInt32 -> Async<Result<List<Report>, Exception>>

type IHeadSearch =
    abstract member SearchProblemSets : string option * List<string> * List<HeadId> * offset:UInt32 * limit:UInt32 -> Async<Result<List<Head>, Exception>>
    