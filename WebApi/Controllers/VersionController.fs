namespace WebApi

open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Authorization
open Services.Folders
open Services.Permissions
open Models.Identificators
open System.Security.Claims
open Services.VersionControl

[<Authorize>]
[<Route("version")>]
type VersionController(foldersService: IFoldersService, permissionsService: IPermissionsService, versionControlService: IVersionControlService) =
    inherit ControllerBase()

    member private this.GetUserId() = UserId(this.User.FindFirst(ClaimTypes.NameIdentifier).Value)

    [<HttpGet>]
    [<Route("head")>]
    member this.GetHead([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let headId = HeadId(id)
            match! permissionsService.CheckPermissions(headId, userId) with
            | Ok() ->
                match! versionControlService.Get(headId) with
                | Result.Error(fail) ->
                    match fail with
                    | Services.VersionControl.GetFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Result.Ok(model) -> return (JsonResult(model) :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("commit")>]
    member this.GetCommit([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let commitId = CommitId(id)
            match! permissionsService.CheckPermissions(commitId, userId) with
            | Ok() ->
                match! versionControlService.Get(commitId) with
                | Result.Error(fail) ->
                    match fail with
                    | Services.VersionControl.GetFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Result.Ok(model) -> return (JsonResult(model) :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask
