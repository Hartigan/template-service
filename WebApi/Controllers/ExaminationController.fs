namespace WebApi

open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Authorization
open Services.Permissions
open DatabaseTypes.Identificators
open System.Security.Claims
open Services.Examination
open Services.Problems
open Services.VersionControl
open Models.Heads
open DatabaseTypes.Identificators
open Models.Reports
open System.Text.Json.Serialization
open Models.Permissions
open Microsoft.Extensions.Logging
open Models.Problems
open Utils.ResultHelper
open Contexts
open System

type ApplyAnswerRequest = {
    [<JsonPropertyName("id")>]
    Id                  : SubmissionId
    [<JsonPropertyName("generated_problem_id")>]
    GeneratedProblemId  : GeneratedProblemId
    [<JsonPropertyName("answer")>]
    Answer              : ProblemAnswer
}

type ShareReportRequest = {
    [<JsonPropertyName("id")>]
    Id                  : ReportId
    [<JsonPropertyName("user_ids")>]
    Users               : List<UserId>
    [<JsonPropertyName("group_ids")>]
    Groups              : List<GroupId>
}

type ProblemSetSearchRequest = {
    [<JsonPropertyName("is_public")>]
    IsPublic            : bool
    [<JsonPropertyName("pattern")>]
    Pattern             : string option
    [<JsonPropertyName("tags")>]
    Tags                : List<TagModel>
    [<JsonPropertyName("author_id")>]
    AuthorId            : UserId option
    [<JsonPropertyName("problems_count")>]
    ProblemsCount       : SearchInterval<uint32> option
    [<JsonPropertyName("duration")>]
    Duration            : SearchInterval<int32> option
    [<JsonPropertyName("offset")>]
    Offset              : uint32
    [<JsonPropertyName("limit")>]
    Limit               : uint32
}

type ReportSearchRequest = {
    [<JsonPropertyName("pattern")>]
    Pattern             : string option
    [<JsonPropertyName("user_id")>]
    UserId              : UserId option
    [<JsonPropertyName("date")>]
    Date                : SearchInterval<DateTimeOffset> option
    [<JsonPropertyName("offset")>]
    Offset              : uint32
    [<JsonPropertyName("limit")>]
    Limit               : uint32
}

[<Authorize>]
[<Route("examination")>]
type ExaminationController(permissionsService: IPermissionsService,
                           versionControlService: IVersionControlService,
                           problemsService: IProblemsService,
                           examinationService: IExaminationService,
                           logger: ILogger<ExaminationController>) =
    inherit ControllerBase()

    member private this.GetUserId() = UserId(this.User.FindFirst(ClaimTypes.NameIdentifier).Value)

    [<HttpGet>]
    [<Route("submission")>]
    member this.GetSubmission([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let submissionId = SubmissionId(id)
            match! permissionsService.CheckPermissions(ProtectedId.Submission(submissionId), userId, AccessModel.CanRead) with
            | Ok() ->
                match! examinationService.Get(submissionId) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot get submossion")
                    return (BadRequestResult() :> IActionResult)
                | Ok(model) -> return (JsonResult(model) :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("answer")>]
    member this.ApplyAnswer([<FromBody>] req: ApplyAnswerRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(ProtectedId.Submission(req.Id), userId, AccessModel.CanWrite) with
            | Ok() ->
                match! examinationService.ApplyAnswer(req.GeneratedProblemId, req.Answer, req.Id) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot apply answer")
                    return (BadRequestResult() :> IActionResult)
                | Ok(model) -> return (JsonResult(model) :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("complete")>]
    member this.CompleteSubmission([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let submissionId = SubmissionId(id)
            match! permissionsService.CheckPermissions(ProtectedId.Submission(submissionId), userId, AccessModel.CanWrite) with
            | Ok() ->
                match! examinationService.Complete(submissionId, userId) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot complete")
                    return (BadRequestResult() :> IActionResult)
                | Ok(model) -> return (JsonResult(Id(model)) :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("start")>]
    member this.StartSubmission([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let headId = HeadId(id)
            match! permissionsService.CheckPermissions(ProtectedId.Head(headId), userId, AccessModel.CanGenerate) with
            | Ok() ->
                match! versionControlService.Get(headId) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot get head for start")
                    return (BadRequestResult() :> IActionResult)
                | Ok(head) ->
                    match head.Commit.Target.ConcreteId with
                    | ConcreteId.ProblemSet(problemSetId) ->
                        match! examinationService.CreateSubmission(problemSetId, userId) with
                        | Error(ex) ->
                            logger.LogError(ex, "Cannot create submission")
                            return (BadRequestResult() :> IActionResult)
                        | Ok(model) -> return (JsonResult(Id(model)) :> IActionResult)
                    | _ ->
                        logger.LogError("Invalid type")
                        return (BadRequestResult() :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied", ex)
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("report")>]
    member this.GetReport([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let reportId = ReportId(id)
            match! permissionsService.CheckPermissions(ProtectedId.Report(reportId), userId, AccessModel.CanRead) with
            | Ok() ->
                match! examinationService.Get(reportId) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot get report")
                    return (BadRequestResult() :> IActionResult)
                | Ok(model) -> return (JsonResult(model) :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("submissions")>]
    member this.GetSubmissions() =
        async {
            let userId = this.GetUserId()
            match! examinationService.GetSubmissions(userId) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get submissions")
                return (BadRequestResult() :> IActionResult)
            | Ok(models) -> return (JsonResult(models) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("reports")>]
    member this.GetReports([<FromBody>] req: ReportSearchRequest) =
        async {
            let userId = this.GetUserId()
            match! examinationService.Search(req.Pattern, userId, req.UserId, req.Date, req.Offset, req.Limit) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get reports by author")
                return (BadRequestResult() :> IActionResult)
            | Ok(models) -> return (JsonResult(models) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("share_report")>]
    member this.ShareReport([<FromBody>] req: ShareReportRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(ProtectedId.Report(req.Id), userId, AccessModel.CanAdministrate) with
            | Ok() ->
                let! result =
                    req.Users
                    |> Seq.map(fun id -> permissionsService.Share(ProtectedId.Report(req.Id), id))
                    |> Seq.append(
                        req.Groups
                        |> Seq.map(fun id -> permissionsService.Share(ProtectedId.Report(req.Id), id))
                    )
                    |> ResultOfAsyncSeq
                match result with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot share report")
                    return (BadRequestResult() :> IActionResult)
                | Ok(model) -> return (JsonResult(model) :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask


    [<HttpPost>]
    [<Route("problem_sets")>]
    member this.GetProblemSets([<FromBody>] req: ProblemSetSearchRequest) =
        async {
            let userId = this.GetUserId()
            match! examinationService.GetProblemSets(req.IsPublic,
                                                     userId,
                                                     req.Pattern,
                                                     req.Tags,
                                                     req.AuthorId,
                                                     req.ProblemsCount,
                                                     req.Duration,
                                                     req.Offset,
                                                     req.Limit) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get problem sets")
                return (BadRequestResult() :> IActionResult)
            | Ok(models) -> return (JsonResult(models) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("problem_set_preview")>]
    member this.GetProblemSetPreview([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let commitId = CommitId(id)

            match! versionControlService.Get(commitId) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get commit for problem set preview")
                return (BadRequestResult() :> IActionResult)
            | Ok(commit) ->
                match! permissionsService.CheckPermissions(ProtectedId.Head(commit.HeadId), userId, AccessModel.CanGenerate) with
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    return (UnauthorizedResult() :> IActionResult)
                | Ok(_) ->
                    match! examinationService.GetProblemSetPreview(commitId) with
                    | Error(ex) ->
                        logger.LogError(ex, "Cannot get problem set preview")
                        return (BadRequestResult() :> IActionResult)
                    | Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("submission_preview")>]
    member this.GetSubmissionPreview([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let submissionId = SubmissionId(id)

            match! permissionsService.CheckPermissions(ProtectedId.Submission(submissionId), userId, AccessModel.CanRead) with
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
            | Ok(_) ->
                match! examinationService.GetPreview(submissionId) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot get submission preview")
                    return (BadRequestResult() :> IActionResult)
                | Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask