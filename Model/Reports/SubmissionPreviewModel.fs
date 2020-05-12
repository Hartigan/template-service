namespace Models.Reports

open Models.Identificators
open System.Text.Json.Serialization
open System
open Models.Problems
open DatabaseTypes
open Models.Permissions

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
        [<JsonPropertyName("author")>]
        Author      : UserModel

    }
    static member Create(entity: Submission,
                         title: ProblemSetTitle,
                         author: UserModel) : Result<SubmissionPreviewModel, Exception> =
        Ok({
            SubmissionPreviewModel.Id       = SubmissionId(entity.Id)
            StartedAt                       = entity.StartedAt
            Deadline                        = entity.Deadline
            Title                           = title
            Completed                       = entity.ReportId.IsSome
            ReportId                        = entity.ReportId |> Option.map ReportId
            Author                          = author
        })
