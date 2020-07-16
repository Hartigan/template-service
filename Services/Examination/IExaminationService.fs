namespace Services.Examination

open DatabaseTypes.Identificators
open System
open Models.Reports
open Models.Problems
open Models.Heads
open Contexts

type IExaminationService =
    abstract member CreateSubmission : ProblemSetId * UserId -> Async<Result<SubmissionId, Exception>>

    abstract member ApplyAnswer : GeneratedProblemId * ProblemAnswer * SubmissionId -> Async<Result<unit, Exception>>
    abstract member Complete : SubmissionId * UserId -> Async<Result<ReportId, Exception>>

    abstract member GetSubmissions : UserId -> Async<Result<List<SubmissionId>, Exception>>
    abstract member Get : SubmissionId -> Async<Result<SubmissionModel, Exception>>
    abstract member GetPreview : SubmissionId -> Async<Result<SubmissionPreviewModel, Exception>>

    abstract member Get : ReportId -> Async<Result<ReportModel, Exception>>
    abstract member Search : string option * userId:UserId * targetId:UserId option * offset:UInt32 * limit:UInt32 -> Async<Result<List<ReportId>, Exception>>

    abstract member GetProblemSets : bool * UserId * string option * List<TagModel> * UserId option * SearchInterval<uint32> option * SearchInterval<int32> option * offset:UInt32 * limit:UInt32 -> Async<Result<List<HeadModel>, Exception>>
    abstract member GetProblemSetPreview : CommitId -> Async<Result<ProblemSetPreviewModel, Exception>>