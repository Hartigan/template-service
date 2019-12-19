namespace Services.Examination

open Models.Identificators
open System
open Models.Reports

type CreateSubmissionFail =
| Error of Exception

type GetFail =
| Error of Exception

type ApplyAnswerFail =
| Error of Exception
| SubmissionAlreadyCompleted of unit
| OutOfTime of unit

type CompleteSubmissionFail =
| Error of Exception

type IExaminationService =
    abstract member CreateSubmission : ProblemSetId * UserId -> Async<Result<SubmissionId, CreateSubmissionFail>>
    abstract member Get : SubmissionId -> Async<Result<SubmissionModel, GetFail>>
    abstract member ApplyAnswer : ProblemAnswerModel * SubmissionId -> Async<Result<unit, ApplyAnswerFail>>
    abstract member Complete : SubmissionId -> Async<Result<ReportId, CompleteSubmissionFail>>
    abstract member Get : ReportId -> Async<Result<ReportModel, GetFail>>
    abstract member GetSubmissions : UserId -> Async<Result<List<SubmissionModel>, GetFail>>
    abstract member GetReports : UserId -> Async<Result<List<ReportModel>, GetFail>>