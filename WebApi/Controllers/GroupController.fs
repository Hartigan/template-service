namespace WebApi

open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Authorization
open Services.Permissions
open DatabaseTypes.Identificators
open System.Security.Claims
open System.Text.Json.Serialization
open Models.Permissions
open Microsoft.Extensions.Logging

type CreateGroupRequest = {
    [<JsonPropertyName("name")>]
    Name: GroupName
    [<JsonPropertyName("description")>]
    Description: GroupDescription
}

type UpdateGroupRequest = {
    [<JsonPropertyName("id")>]
    Id: GroupId
    [<JsonPropertyName("name")>]
    Name: GroupName option
    [<JsonPropertyName("description")>]
    Description: GroupDescription option
}

type UpdateGroupMemberRequest = {
    [<JsonPropertyName("id")>]
    Id: GroupId
    [<JsonPropertyName("user_id")>]
    UserId: UserId
    [<JsonPropertyName("access")>]
    Access: AccessModel
}

type RemoveGroupMemberRequest = {
    [<JsonPropertyName("id")>]
    Id: GroupId
    [<JsonPropertyName("user_id")>]
    UserId: UserId
}

type AddGroupMemberRequest = {
    [<JsonPropertyName("id")>]
    Id: GroupId
    [<JsonPropertyName("user_id")>]
    UserId: UserId
}

type GroupSearchRequest = {
    [<JsonPropertyName("pattern")>]
    Pattern : string option
    [<JsonPropertyName("offset")>]
    Offset : uint32
    [<JsonPropertyName("limit")>]
    Limit : uint32
}

[<Authorize(Roles="admin")>]
[<Route("group")>]
type GroupController(permissionsService: IPermissionsService,
                     groupService: IGroupService,
                     logger: ILogger<GroupController>) =
    inherit ControllerBase()

    member private this.GetUserId() = UserId(this.User.FindFirst(ClaimTypes.NameIdentifier).Value)

    [<HttpPost>]
    [<Route("create")>]
    member this.CreateGroup([<FromBody>] req: CreateGroupRequest) =
        async {
            let userId = this.GetUserId()

            match! groupService.Create(userId, req.Name, req.Description) with
            | Ok(groupId) ->
                return (JsonResult(Id(groupId)) :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Cannot create group")
                return (BadRequestResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("get")>]
    member this.GetGroup([<FromQuery(Name = "id")>] id: string) =
        async {
            let groupId = GroupId(id)
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(groupId, userId, AccessModel.CanRead) with
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
            | Ok() ->
                match! groupService.Get(groupId) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot get group")
                    return (BadRequestResult() :> IActionResult)
                | Ok(model) ->
                    return (JsonResult(model) :> IActionResult)
        }

    [<HttpGet>]
    [<Route("list")>]
    member this.GetGroups([<FromQuery(Name = "admin")>] canAdministrate: bool,
                          [<FromQuery(Name = "read")>] canRead: bool,
                          [<FromQuery(Name = "write")>] canWrite: bool,
                          [<FromQuery(Name = "generate")>] canGenerate: bool) =
        async {
            let userId = this.GetUserId()
            let access =
                {
                    AccessModel.Admin = canAdministrate
                    Read = canRead
                    Write = canWrite
                    Generate = canGenerate
                }
            match! permissionsService.Get(userId, access) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot fetch groups")
                return (BadRequestResult() :> IActionResult)
            | Ok(model) ->
                return (JsonResult(model) :> IActionResult)
        }

    [<HttpPost>]
    [<Route("update")>]
    member this.UpdateGroup([<FromBody>] req: UpdateGroupRequest) =
        async {
            let userId = this.GetUserId()

            match! permissionsService.CheckPermissions(req.Id, userId, AccessModel.CanAdministrate) with
            | Ok() ->
                match! groupService.Update(req.Id, req.Name, req.Description) with
                | Ok(model) ->
                    return (JsonResult(model) :> IActionResult)
                | Error(ex) ->
                    logger.LogError(ex, "Cannot update group")
                    return (BadRequestResult() :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("update_member")>]
    member this.UpdateGroupMember([<FromBody>] req: UpdateGroupMemberRequest) =
        async {
            let userId = this.GetUserId()

            match! permissionsService.CheckPermissions(req.Id, userId, AccessModel.CanAdministrate) with
            | Ok() ->
                match! groupService.Update(req.Id, req.UserId, req.Access) with
                | Ok(model) ->
                    return (JsonResult(model) :> IActionResult)
                | Error(ex) ->
                    logger.LogError(ex, "Cannot update group member")
                    return (BadRequestResult() :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("remove_member")>]
    member this.RemoveGroupMember([<FromBody>] req: RemoveGroupMemberRequest) =
        async {
            let userId = this.GetUserId()

            match! permissionsService.CheckPermissions(req.Id, userId, AccessModel.CanAdministrate) with
            | Ok() ->
                match! groupService.Remove(req.Id, req.UserId) with
                | Ok(model) ->
                    return (JsonResult(model) :> IActionResult)
                | Error(ex) ->
                    logger.LogError(ex, "Cannot remove group member")
                    return (BadRequestResult() :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("add_member")>]
    member this.AddGroupMember([<FromBody>] req: AddGroupMemberRequest) =
        async {
            let userId = this.GetUserId()

            match! permissionsService.CheckPermissions(req.Id, userId, AccessModel.CanAdministrate) with
            | Ok() ->
                match! groupService.Add(req.Id, req.UserId) with
                | Ok(model) ->
                    return (JsonResult(model) :> IActionResult)
                | Error(ex) ->
                    logger.LogError(ex, "Cannot add group member")
                    return (BadRequestResult() :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("search")>]
    member this.Search([<FromBody>] req: GroupSearchRequest) =
        async {
            match! groupService.Search(req.Pattern, req.Offset, req.Limit) with
            | Error(ex) ->
                logger.LogError(ex, "Search failed")
                return (BadRequestResult() :> IActionResult)
            | Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask