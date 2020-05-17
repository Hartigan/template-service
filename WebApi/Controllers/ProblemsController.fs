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

type CreateProblemRequest = {
    [<JsonPropertyName("folder_id")>]
    Folder: FolderId
    [<JsonPropertyName("name")>]
    Name: HeadName
    [<JsonPropertyName("problem")>]
    Problem : ProblemModel
}

type UpdateProblemRequest = {
    [<JsonPropertyName("head_id")>]
    Head: HeadId
    [<JsonPropertyName("description")>]
    Description: CommitDescription
    [<JsonPropertyName("problem")>]
    Problem : ProblemModel
}

[<Authorize>]
[<Route("problems")>]
type ProblemsController(foldersService: IFoldersService,
                        permissionsService: IPermissionsService,
                        versionControlService: IVersionControlService,
                        problemsService: IProblemsService,
                        generatorService: IGeneratorService,
                        logger: ILogger<ProblemsController>) =
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
                logger.LogError(ex, "Cannot get commit for problem")
                return (BadRequestResult() :> IActionResult)
            | Ok(commit) ->
                match! permissionsService.CheckPermissions(ProtectedId.Head(commit.HeadId), userId, AccessModel.CanRead) with
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    return (UnauthorizedResult() :> IActionResult)
                | Ok() ->
                    match commit.Target.ConcreteId with
                    | Problem(problemId) ->
                        match! problemsService.Get(problemId) with
                        | Ok(model) -> return (JsonResult(model) :> IActionResult)
                        | Error(ex) -> 
                            logger.LogError(ex, "Cannot get problem")
                            return (BadRequestResult() :> IActionResult)
                    | _ ->
                        logger.LogError("Invalid type")
                        return (BadRequestResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("test")>]
    member this.Test([<FromQuery(Name = "id")>] id: string,
                     [<FromQuery(Name = "seed")>] seed: int) =
        async {
            let userId = this.GetUserId()
            let commitId = CommitId(id)
            let problemSeed = ProblemSeed(seed)

            match! versionControlService.Get(commitId) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get commit for problem")
                return (BadRequestResult() :> IActionResult)
            | Ok(commit) ->
                match! permissionsService.CheckPermissions(ProtectedId.Head(commit.HeadId), userId, AccessModel.CanRead) with
                | Ok() ->
                    match commit.Target.ConcreteId with
                    | Problem(problemId) ->
                        match! generatorService.TestGenerate(problemId, problemSeed) with
                        | Ok(model) -> return (JsonResult(model) :> IActionResult)
                        | Error(ex) -> 
                            logger.LogError(ex, "Cannot generate problem")
                            return (BadRequestResult() :> IActionResult)
                    | _ ->
                        logger.LogError("Invalid type")
                        return (BadRequestResult() :> IActionResult)
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("validate")>]
    member this.Validate([<FromQuery(Name = "id")>] id: string,
                         [<FromQuery(Name = "actual")>] actual: string,
                         [<FromQuery(Name = "expected")>] expected: string) =
        async {
            let userId = this.GetUserId()
            let commitId = CommitId(id)
            let actualAnswer = ProblemAnswer(actual)
            let expectedAnswer = ProblemAnswer(expected)

            match! versionControlService.Get(commitId) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get commit for problem")
                return (BadRequestResult() :> IActionResult)
            | Ok(commit) ->
                match! permissionsService.CheckPermissions(ProtectedId.Head(commit.HeadId), userId, AccessModel.CanRead) with
                | Ok() ->
                    match commit.Target.ConcreteId with
                    | Problem(problemId) ->
                        match! generatorService.TestValidate(problemId, expectedAnswer, actualAnswer) with
                        | Ok(model) -> return (JsonResult(model) :> IActionResult)
                        | Error(ex) ->
                            logger.LogError(ex, "Cannot generate problem")
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
    member this.CreateProblem([<FromBody>] req: CreateProblemRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(ProtectedId.Folder(req.Folder), userId, AccessModel.CanWrite) with
            | Ok() ->
                match! problemsService.Create(req.Problem) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot create problem") 
                    return (BadRequestResult() :> IActionResult)
                | Ok(problemId) ->
                    match! versionControlService.Create(req.Name, ConcreteId.Problem(problemId), CommitDescription("Initial commit"), userId) with
                    | Error(ex) ->
                        logger.LogError(ex, "Cannot commit problem")
                        return (BadRequestResult() :> IActionResult)
                    | Ok(headId) ->
                        match! foldersService.AddHead(headId, req.Folder) with
                        | Error(ex) ->
                            logger.LogError(ex, "Cannot create head for problem")
                            return (BadRequestResult() :> IActionResult)
                        | Ok() -> return (JsonResult(Id(headId)) :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied") 
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("update")>]
    member this.UpdateProblem([<FromBody>] req: UpdateProblemRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(ProtectedId.Head(req.Head), userId, AccessModel.CanWrite) with
            | Ok() ->
                match! problemsService.Create(req.Problem) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot update problem") 
                    return (BadRequestResult() :> IActionResult)
                | Ok(problemId) ->
                    match! versionControlService.Create(ConcreteId.Problem(problemId), req.Description, userId, req.Head) with
                    | Error(ex) ->
                        logger.LogError(ex, "Cannot commit changes of problem")
                        return (BadRequestResult() :> IActionResult)
                    | Ok(commitId) -> return (JsonResult(Id(commitId)) :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied") 
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask
