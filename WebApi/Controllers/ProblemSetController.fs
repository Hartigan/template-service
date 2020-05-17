namespace WebApi

open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Authorization
open Services.Folders
open Services.Permissions
open DatabaseTypes.Identificators
open Models.Heads
open System.Security.Claims
open Services.VersionControl
open Services.Problems
open Models.Problems
open Microsoft.AspNetCore.Http
open System.Text.Json.Serialization
open Models.Permissions
open Microsoft.Extensions.Logging

type CreateProblemSetRequest = {
    [<JsonPropertyName("folder_id")>]
    Folder: FolderId
    [<JsonPropertyName("name")>]
    Name: HeadName
    [<JsonPropertyName("problem_set")>]
    ProblemSet : ProblemSetModel
}

type UpdateProblemSetRequest = {
    [<JsonPropertyName("head_id")>]
    Head: HeadId
    [<JsonPropertyName("description")>]
    Description: CommitDescription
    [<JsonPropertyName("problem_set")>]
    ProblemSet : ProblemSetModel
}

[<Authorize>]
[<Route("problem_set")>]
type ProblemSetController(foldersService: IFoldersService,
                          permissionsService: IPermissionsService,
                          versionControlService: IVersionControlService,
                          problemsService: IProblemsService,
                          logger: ILogger<ProblemSetController>) =
    inherit ControllerBase()

    member private this.GetUserId() = UserId(this.User.FindFirst(ClaimTypes.NameIdentifier).Value)

    [<HttpGet>]
    [<Route("model")>]
    member this.GetModel([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let commitId = CommitId(id)

            match! versionControlService.Get(commitId) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get commit for problem set")
                return (BadRequestResult() :> IActionResult)
            | Ok(commit) ->
                match! permissionsService.CheckPermissions(ProtectedId.Head(commit.HeadId), userId, AccessModel.CanRead) with
                | Ok() ->
                    match commit.Target.ConcreteId with
                    | ProblemSet(problemSetId) ->
                        match! problemsService.Get(problemSetId) with
                        | Ok(model) -> return (JsonResult(model) :> IActionResult)
                        | Error(ex) ->
                            logger.LogError(ex, "Cannot get problem set")
                            return (BadRequestResult() :> IActionResult)
                    | _ ->
                        logger.LogError("Invalid type")
                        return (BadRequestResult() :> IActionResult)
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("create")>]
    member this.CreateProblem([<FromBody>] req: CreateProblemSetRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(ProtectedId.Folder(req.Folder), userId, AccessModel.CanWrite) with
            | Ok() ->
                match! problemsService.Create(req.ProblemSet) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot create problem set")
                    return (BadRequestResult() :> IActionResult)
                | Ok(problemSetId) ->
                    match! versionControlService.Create(req.Name, ConcreteId.ProblemSet(problemSetId), CommitDescription("Initial commit"), userId) with
                    | Error(ex) ->
                        logger.LogError(ex, "Cannot commit problem set")
                        return (BadRequestResult() :> IActionResult)
                    | Ok(headId) ->
                        match! foldersService.AddHead(headId, req.Folder) with
                        | Error(ex) ->
                            logger.LogError(ex, "Cannot add head for problem set")
                            return (BadRequestResult() :> IActionResult)
                        | Ok() -> return (JsonResult(Id(headId)) :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("update")>]
    member this.UpdateProblem([<FromBody>] req: UpdateProblemSetRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(ProtectedId.Head(req.Head), userId, AccessModel.CanWrite) with
            | Ok() ->
                match! problemsService.Create(req.ProblemSet) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot update problem set")
                    return (BadRequestResult() :> IActionResult)
                | Ok(problemSetId) ->
                    match! versionControlService.Create(ConcreteId.ProblemSet(problemSetId), req.Description, userId, req.Head) with
                    | Error(ex) ->
                        logger.LogError(ex, "Cannot commit changes for problem set")
                        return (BadRequestResult() :> IActionResult)
                    | Ok(commitId) -> return (JsonResult(Id(commitId)) :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask
