namespace Models.Reports

open DatabaseTypes
open DatabaseTypes.Identificators
open Utils.Converters
open Models.Permissions
open Models.Problems
open System.Text.Json.Serialization
open System


type ProblemReportModel =
    {
        [<JsonPropertyName("id")>]
        Id              : GeneratedProblemId
        [<JsonPropertyName("title")>]
        Title           : ProblemTitle
        [<JsonPropertyName("view")>]
        View            : GeneratedViewModel
        [<JsonPropertyName("answer")>]
        Answer          : ProblemAnswer option
        [<JsonPropertyName("expected_answer")>]
        ExpectedAnswer  : ProblemAnswer
        [<JsonPropertyName("is_correct")>]
        IsCorrect       : bool
        [<JsonPropertyName("timestamp")>]
        Timespan        : DateTimeOffset option
    }

    static member Create(entity: ProblemReport,
                         problem: GeneratedProblemModel) : Result<ProblemReportModel, Exception> =
        Ok({
            Id              = GeneratedProblemId(entity.GeneratedProblemId)
            Title           = problem.Title
            View            = problem.View
            Answer          = entity.Answer |> Option.map ProblemAnswer
            ExpectedAnswer  = ProblemAnswer(entity.ExpectedAnswer)
            IsCorrect       = entity.IsCorrect
            Timespan        = entity.Timestamp
        })

type ProblemSetReportModel =
    {
        [<JsonPropertyName("id")>]
        Id           : GeneratedProblemSetId
        [<JsonPropertyName("title")>]
        Title        : ProblemSetTitle
        [<JsonPropertyName("problems")>]
        Problems     : List<ProblemReportModel>
    }

    static member Create(model: GeneratedProblemSetModel,
                         problems: List<ProblemReportModel>) : Result<ProblemSetReportModel, Exception> =

        Ok({
            Id          = model.Id
            Title       = model.Title
            Problems    = problems
        })

type ReportModel =
    {
        [<JsonPropertyName("id")>]
        Id                      : ReportId
        [<JsonPropertyName("problem_set")>]
        ProblemSet              : ProblemSetReportModel
        [<JsonPropertyName("started_at")>]
        StartedAt               : DateTimeOffset
        [<JsonPropertyName("finished_at")>]
        FinishedAt              : DateTimeOffset
        [<JsonPropertyName("author")>]
        Author                  : UserModel
    }

    static member Create(entity: Report,
                         problemSet: ProblemSetReportModel,
                         author: UserModel) : Result<ReportModel, Exception> =
        Ok({
            Id              = ReportId(entity.Id)
            ProblemSet      = problemSet
            StartedAt       = entity.StartedAt
            FinishedAt      = entity.FinishedAt
            Author          = author
        })