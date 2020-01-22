namespace WebApi

open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Authorization
open Services.Folders
open Services.Permissions
open Models.Identificators
open Models.Heads
open System.Security.Claims
open Services.VersionControl
open Services.Problems
open Models.Problems
open Microsoft.AspNetCore.Http
open System.Text.Json.Serialization
open Models.Permissions

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
type ProblemsController(foldersService: IFoldersService, permissionsService: IPermissionsService, versionControlService: IVersionControlService, problemsService: IProblemsService) =
    inherit ControllerBase()

    member private this.GetUserId() = UserId(this.User.FindFirst(ClaimTypes.NameIdentifier).Value)

    [<HttpGet>]
    [<Route("model")>]
    member this.GetModel([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let commitId = CommitId(id)
            match! permissionsService.CheckPermissions(ProtectedId.Commit(commitId), userId, AccessModel.CanRead) with
            | Ok() ->
                match! versionControlService.Get(commitId) with
                | Result.Error(fail) ->
                    match fail with
                    | Services.VersionControl.GetFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Result.Ok(commit) ->
                    match commit.Target.ConcreteId with
                    | Problem(problemId) ->
                        match! problemsService.Get(problemId) with
                        | Ok(model) -> return (JsonResult(model) :> IActionResult)
                        | _ -> return (StatusCodeResult(StatusCodes.Status500InternalServerError) :> IActionResult)
                    | _ -> return (StatusCodeResult(StatusCodes.Status500InternalServerError) :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
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
                | Result.Error(fail) ->
                    match fail with
                    | CreateFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Ok(problemId) ->
                    match! versionControlService.Create(req.Name, ConcreteId.Problem(problemId), CommitDescription("Initial commit"), userId) with
                    | Result.Error(fail) ->
                        match fail with
                        | Services.VersionControl.CreateFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                    | Result.Ok(headId) ->
                        match! foldersService.AddHead(headId, req.Folder) with
                        | Result.Error(fail) ->
                            match fail with
                            | AddFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                        | Ok() -> return (JsonResult(Id(headId)) :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
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
                | Result.Error(fail) ->
                    match fail with
                    | CreateFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Ok(problemId) ->
                    match! versionControlService.Create(ConcreteId.Problem(problemId), req.Description, userId, req.Head) with
                    | Result.Error(fail) ->
                        match fail with
                        | Services.VersionControl.CreateFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                    | Result.Ok(commitId) -> return (JsonResult(Id(commitId)) :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask
