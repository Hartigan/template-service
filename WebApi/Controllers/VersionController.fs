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
open System.Text.Json.Serialization
open Models.Heads

type UpdateTagsRequest = {
    [<JsonPropertyName("head_id")>]
    HeadId : HeadId
    [<JsonPropertyName("tags")>]
    Tags : List<TagModel>
}

type SearchHeadsRequest = {
    [<JsonPropertyName("owner_id")>]
    OwnerId : UserId option
    [<JsonPropertyName("tags")>]
    Tags : List<TagModel>
    [<JsonPropertyName("pattern")>]
    Pattern : string option
    [<JsonPropertyName("offset")>]
    Offset : uint32
    [<JsonPropertyName("limit")>]
    Limit : uint32
}

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

    [<HttpPost>]
    [<Route("update_tags")>]
    member this.UpdateTags([<FromBody>] req: UpdateTagsRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(ProtectedId.Head(req.HeadId), userId, AccessModel.CanWrite) with
            | Ok() ->
                match! versionControlService.Update(req.HeadId, req.Tags) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot update tags")
                    return (BadRequestResult() :> IActionResult)
                | Ok(model) -> return (JsonResult(model) :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("search")>]
    member this.Search([<FromBody>] req: SearchHeadsRequest) =
        async {
            let userId = this.GetUserId()
            match! versionControlService.Search(userId, req.Pattern, req.OwnerId, req.Tags, req.Offset, req.Limit) with
            | Error(ex) ->
                logger.LogError(ex, "Search of heads failed")
                return (BadRequestResult() :> IActionResult)
            | Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask
