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

type ApplyAnswerRequest = {
    [<JsonPropertyName("id")>]
    Id                  : SubmissionId
    [<JsonPropertyName("generated_problem_id")>]
    GeneratedProblemId  : GeneratedProblemId
    [<JsonPropertyName("answer")>]
    Answer              : ProblemAnswer
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
    member this.Complete([<FromQuery(Name = "id")>] id: string) =
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
    member this.Start([<FromQuery(Name = "id")>] id: string) =
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

    [<HttpGet>]
    [<Route("reports")>]
    member this.GetReports() =
        async {
            let userId = this.GetUserId()
            match! examinationService.GetReports(userId) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get reports")
                return (BadRequestResult() :> IActionResult)
            | Ok(models) -> return (JsonResult(models) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("problem_sets")>]
    member this.GetProblemSets() =
        async {
            let userId = this.GetUserId()
            match! examinationService.GetProblemSets(userId) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get problem sets")
                return (BadRequestResult() :> IActionResult)
            | Ok(models) -> return (JsonResult(models) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("problem_set_preview")>]
    member this.GetProblemSets([<FromQuery(Name = "id")>] id: string) =
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