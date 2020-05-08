namespace Services.Examination

open Models.Identificators
open System
open Models.Reports
open Models.Problems
open Models.Heads

type IExaminationService =
    abstract member CreateSubmission : ProblemSetId * UserId -> Async<Result<SubmissionId, Exception>>
    abstract member Get : SubmissionId -> Async<Result<SubmissionModel, Exception>>
    abstract member ApplyAnswer : ProblemAnswerModel * SubmissionId -> Async<Result<unit, Exception>>
    abstract member Complete : SubmissionId * UserId -> Async<Result<ReportId, Exception>>
    abstract member Get : ReportId -> Async<Result<ReportModel, Exception>>
    abstract member GetSubmissions : UserId -> Async<Result<List<SubmissionModel>, Exception>>
    abstract member GetReports : UserId -> Async<Result<List<ReportModel>, Exception>>
    abstract member GetProblemSets : UserId -> Async<Result<List<HeadModel>, Exception>>
    abstract member GetProblemSetPreview : CommitId -> Async<Result<ProblemSetPreviewModel, Exception>>