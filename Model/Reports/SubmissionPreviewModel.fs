namespace Models.Reports

open Models.Identificators
open System.Text.Json.Serialization
open System
open Models.Problems

type SubmissionPreviewModel =
    {
        [<JsonPropertyName("id")>]
        Id          : SubmissionId
        [<JsonPropertyName("started_at")>]
        StartedAt   : DateTimeOffset
        [<JsonPropertyName("deadline")>]
        Deadline    : DateTimeOffset
        [<JsonPropertyName("title")>]
        Title       : ProblemSetTitle
        [<JsonPropertyName("completed")>]
        Completed   : bool
        [<JsonPropertyName("report_id")>]
        ReportId    : option<ReportId>

    }
    static member Create(submission: SubmissionModel) : Result<SubmissionPreviewModel, Exception> =
        Ok({
            SubmissionPreviewModel.Id       = submission.Id
            StartedAt                       = submission.StartedAt
            Deadline                        = submission.Deadline
            Title                           = submission.GeneratedProblemSet.Title
            Completed                       = submission.Completed
            ReportId                        = submission.ReportId
        })
