namespace Services.Examination

open Models.Identificators
open System
open Models.Reports

type IExaminationService =
    abstract member CreateSubmission : ProblemSetId * UserId -> Async<Result<SubmissionId, Exception>>
    abstract member Get : SubmissionId -> Async<Result<SubmissionModel, Exception>>
    abstract member ApplyAnswer : ProblemAnswerModel * SubmissionId -> Async<Result<unit, Exception>>
    abstract member Complete : SubmissionId -> Async<Result<ReportId, Exception>>
    abstract member Get : ReportId -> Async<Result<ReportModel, Exception>>
    abstract member GetSubmissions : UserId -> Async<Result<List<SubmissionModel>, Exception>>
    abstract member GetReports : UserId -> Async<Result<List<ReportModel>, Exception>>