namespace Models.Problems

open DatabaseTypes.Identificators
open System.Text.Json.Serialization
open System
open Models.Permissions

type ProblemSetPreviewModel =
    {
        [<JsonPropertyName("id")>]
        Id              : ProblemSetId
        [<JsonPropertyName("title")>]
        Title           : ProblemSetTitle
        [<JsonPropertyName("problems_count")>]
        ProblemsCount   : uint32
        [<JsonPropertyName("duration")>]
        Duration        : DurationModel
        [<JsonPropertyName("author")>]
        Author          : UserModel
    }
    static member Create(problemSet: ProblemSetModel, author: UserModel) : Result<ProblemSetPreviewModel, Exception> =
        Ok({
            ProblemSetPreviewModel.Id   = problemSet.Id
            Title                       = problemSet.Title
            ProblemsCount               = uint32 problemSet.Heads.Length
            Duration                    = problemSet.Duration
            Author                      = author
        })
