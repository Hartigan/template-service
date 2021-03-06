namespace Models.Reports

open DatabaseTypes
open DatabaseTypes.Identificators
open Utils.Converters
open Models.Permissions
open Models.Problems
open System.Text.Json.Serialization
open System
open Utils.ResultHelper

type ProblemAnswerModel =
    {
        [<JsonPropertyName("generated_problem_id")>]
        GeneratedProblemId  : GeneratedProblemId
        [<JsonPropertyName("answer")>]
        Answer              : ProblemAnswer
        [<JsonPropertyName("timestamp")>]
        Timestamp           : DateTimeOffset
    }

    static member Create(entity: DatabaseTypes.ProblemAnswer) : Result<ProblemAnswerModel, Exception> =
        Ok({
            GeneratedProblemId  = entity.GeneratedProblemId
            Answer              = ProblemAnswer(entity.Answer)
            Timestamp           = entity.Timestamp
        })

type SubmissionProblemModel =
    {
        [<JsonPropertyName("id")>]
        Id           : GeneratedProblemId
        [<JsonPropertyName("title")>]
        Title        : ProblemTitle
        [<JsonPropertyName("view")>]
        View         : GeneratedViewModel
    }

    static member Create(model: GeneratedProblemModel) : Result<SubmissionProblemModel, Exception> =
        Ok({
            Id      = model.Id
            Title   = model.Title
            View    = model.View
        })

type SubmissionProblemSetModel =
    {
        [<JsonPropertyName("id")>]
        Id           : GeneratedProblemSetId
        [<JsonPropertyName("title")>]
        Title        : ProblemSetTitle
        [<JsonPropertyName("problems")>]
        Problems     : List<SubmissionProblemModel>
    }

    static member Create(model: GeneratedProblemSetModel,
                         problems: List<GeneratedProblemModel>) : Result<SubmissionProblemSetModel, Exception> =
        problems
        |> Seq.map SubmissionProblemModel.Create
        |> ResultOfSeq
        |> fun r ->
            match r with
            | Error(error) -> Error(error)
            | Ok(submissionProblems) ->
                Ok({
                    Id          = model.Id
                    Title       = model.Title
                    Problems    = submissionProblems
                })

type SubmissionModel = 
    {
        [<JsonPropertyName("id")>]
        Id                      : SubmissionId
        [<JsonPropertyName("problem_set")>]
        ProblemSet              : SubmissionProblemSetModel
        [<JsonPropertyName("started_at")>]
        StartedAt               : DateTimeOffset
        [<JsonPropertyName("deadline")>]
        Deadline                : DateTimeOffset
        [<JsonPropertyName("answers")>]
        Answers                 : List<ProblemAnswerModel>
        [<JsonPropertyName("completed")>]
        Completed               : bool
        [<JsonPropertyName("report_id")>]
        ReportId                : option<ReportId>
        [<JsonPropertyName("author")>]
        Author                  : UserModel
    }

    static member Create(entity: Submission,
                         submissionProblemSetModel: SubmissionProblemSetModel,
                         author: UserModel) : Result<SubmissionModel, Exception> =
        let answersResult =
            entity.Answers
            |> Seq.map ProblemAnswerModel.Create
            |> ResultOfSeq

        match answersResult with
        | Error(error) -> Error(error)
        | Ok(answers) ->
            Ok({
                Id                      = entity.Id
                ProblemSet              = submissionProblemSetModel
                StartedAt               = entity.StartedAt
                Deadline                = entity.Deadline
                Answers                 = answers
                Completed               = entity.ReportId.IsSome
                ReportId                = entity.ReportId
                Author                  = author
            })
