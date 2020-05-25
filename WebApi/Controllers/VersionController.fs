namespace WebApi

open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Authorization
open Services.Folders
open Services.Permissions
open DatabaseTypes.Identificators
open System.Security.Claims
open Services.VersionControl
open Models.Permissions
open Microsoft.Extensions.Logging

[<Authorize(Roles="admin")>]
[<Route("version")>]
type VersionController(foldersService: IFoldersService,
                       permissionsService: IPermissionsService,
                       versionControlService: IVersionControlService,
                       logger: ILogger<VersionController>) =
    inherit ControllerBase()

    member private this.GetUserId() = UserId(this.User.FindFirst(ClaimTypes.NameIdentifier).Value)

    [<HttpGet>]
    [<Route("head")>]
    member this.GetHead([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let headId = HeadId(id)
            match! permissionsService.CheckPermissions(ProtectedId.Head(headId), userId, AccessModel.CanRead) with
            | Ok() ->
                match! versionControlService.Get(headId) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot get head")
                    return (BadRequestResult() :> IActionResult)
                | Ok(model) -> return (JsonResult(model) :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("commit")>]
    member this.GetCommit([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let commitId = CommitId(id)

            match! versionControlService.Get(commitId) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get commit")
                return (BadRequestResult() :> IActionResult)
            | Ok(commit) ->
                match! permissionsService.CheckPermissions(ProtectedId.Head(commit.HeadId), userId, AccessModel.CanRead) with
                | Ok() ->
                    return (JsonResult(commit) :> IActionResult)
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask
