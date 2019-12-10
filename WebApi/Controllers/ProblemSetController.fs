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

[<Authorize>]
[<Route("problem_set")>]
type ProblemSetController(foldersService: IFoldersService, permissionsService: IPermissionsService, versionControlService: IVersionControlService, problemsService: IProblemsService) =
    inherit ControllerBase()

    member private this.GetUserId() = UserId(this.User.FindFirst(ClaimTypes.NameIdentifier).Value)

    [<HttpGet>]
    [<Route("model")>]
    member this.GetModel([<FromQuery(Name = "commit_id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let commitId = CommitId(id)
            match! permissionsService.CheckPermissions(commitId, userId) with
            | Ok() ->
                match! versionControlService.Get(commitId) with
                | Result.Error(fail) ->
                    match fail with
                    | Services.VersionControl.GetFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Result.Ok(commit) ->
                    match commit.Target.ConcreteId with
                    | ProblemSet(problemSetId) ->
                        match! problemsService.Get(problemSetId) with
                        | Ok(model) -> return (JsonResult(model) :> IActionResult)
                        | _ -> return (StatusCodeResult(StatusCodes.Status500InternalServerError) :> IActionResult)
                    | _ -> return (StatusCodeResult(StatusCodes.Status500InternalServerError) :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("create")>]
    member this.CreateProblem([<FromQuery(Name = "folder_id")>] folderIdString: string,
                              [<FromQuery(Name = "name")>] name: string,
                              [<FromBody>] model: ProblemSetModel) =
        async {
            let userId = this.GetUserId()
            let folderId = FolderId(folderIdString)
            match! permissionsService.CheckPermissions(folderId, userId) with
            | Ok() ->
                match! problemsService.Create(model) with
                | Result.Error(fail) ->
                    match fail with
                    | CreateFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Ok(problemId) ->
                    match! versionControlService.Create(HeadName(name), ConcreteId.ProblemSet(model.Id), CommitDescription("Initial commit"), userId) with
                    | Result.Error(fail) ->
                        match fail with
                        | Services.VersionControl.CreateFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                    | Result.Ok(headId) ->
                        match! foldersService.AddHead(headId, folderId) with
                        | Result.Error(fail) ->
                            match fail with
                            | AddFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                        | Ok() -> return (JsonResult(headId) :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("update")>]
    member this.UpdateProblem([<FromQuery(Name = "head_id")>] headIdString: string,
                              [<FromQuery(Name = "description")>] description: string,
                              [<FromBody>] model: ProblemSetModel) =
        async {
            let userId = this.GetUserId()
            let headId = HeadId(headIdString)
            match! permissionsService.CheckPermissions(headId, userId) with
            | Ok() ->
                match! problemsService.Create(model) with
                | Result.Error(fail) ->
                    match fail with
                    | CreateFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Ok(problemId) ->
                    match! versionControlService.Create(ConcreteId.ProblemSet(model.Id), CommitDescription(description), userId, headId) with
                    | Result.Error(fail) ->
                        match fail with
                        | Services.VersionControl.CreateFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                    | Result.Ok(commitId) -> return (JsonResult(commitId) :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask
