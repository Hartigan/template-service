namespace WebApi

open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Authorization
open Services.Permissions
open DatabaseTypes.Identificators
open System.Security.Claims
open System.Text.Json.Serialization
open Models.Permissions
open Microsoft.Extensions.Logging

type UpdateMemberRequest = {
    [<JsonPropertyName("user_id")>]
    UserId: UserId
    [<JsonPropertyName("access")>]
    Access: AccessModel
}

type RemoveMemberRequest = {
    [<JsonPropertyName("user_id")>]
    UserId: UserId
}

type AddMemberRequest = {
    [<JsonPropertyName("user_id")>]
    UserId: UserId
}

type UpdatePermissionsGroupRequest = {
    [<JsonPropertyName("group_id")>]
    GroupId: GroupId
    [<JsonPropertyName("access")>]
    Access: AccessModel
}

type RemovePermissionsGroupRequest = {
    [<JsonPropertyName("group_id")>]
    GroupId: GroupId
}

type AddPermissionsGroupRequest = {
    [<JsonPropertyName("group_id")>]
    GroupId: GroupId
}

[<Authorize(Roles="admin")>]
[<Route("permissions")>]
type PermissionsController(permissionsService: IPermissionsService,
                           logger: ILogger<PermissionsController>) =
    inherit ControllerBase()

    member private this.GetUserId() = UserId(this.User.FindFirst(ClaimTypes.NameIdentifier).Value)

    [<HttpGet>]
    [<Route("permissions")>]
    member this.GetPermissions([<FromQuery(Name = "id")>] id: string, [<FromQuery(Name = "type")>] typeName: string) =
        async {
            match ProtectedId.Create(id, typeName) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get permissions")
                return (BadRequestResult() :> IActionResult)
            | Ok(protectedId) ->
                let userId = this.GetUserId()
                match! permissionsService.CheckPermissions(protectedId, userId, AccessModel.CanAdministrate) with
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    return (UnauthorizedResult() :> IActionResult)
                | Ok() ->
                    match! permissionsService.Get(protectedId) with
                    | Error(ex) ->
                        logger.LogError(ex, "Cannot get permissions")
                        return (BadRequestResult() :> IActionResult)
                    | Ok(model) ->
                        return (JsonResult(model) :> IActionResult)
        }

    [<HttpPost>]
    [<Route("update_permissions_group")>]
    member this.UpdatePermissionsGroup
        ([<FromQuery(Name = "id")>] id: string,
        [<FromQuery(Name = "type")>] typeName: string,
        [<FromBody>] req: UpdatePermissionsGroupRequest) =
        async {
            let userId = this.GetUserId()

            match ProtectedId.Create(id, typeName) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot update group permissions")
                return (BadRequestResult() :> IActionResult)

            | Ok(protectedId) ->
                match! permissionsService.CheckPermissions(protectedId, userId, AccessModel.CanAdministrate) with
                | Ok() ->
                    match! permissionsService.Update(protectedId, req.GroupId, req.Access) with
                    | Ok(model) ->
                        return (JsonResult(model) :> IActionResult)
                    | Error(ex) ->
                        logger.LogError(ex, "Cannot udpate group permissions")
                        return (BadRequestResult() :> IActionResult)
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("remove_permissions_group")>]
    member this.RemovePermissionsGroup
        ([<FromQuery(Name = "id")>] id: string,
        [<FromQuery(Name = "type")>] typeName: string,
        [<FromBody>] req: RemovePermissionsGroupRequest) =
        async {
            let userId = this.GetUserId()

            match ProtectedId.Create(id, typeName) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot remove group from permissions")
                return (BadRequestResult() :> IActionResult)

            | Ok(protectedId) ->
                match! permissionsService.CheckPermissions(protectedId, userId, AccessModel.CanAdministrate) with
                | Ok() ->
                    match! permissionsService.Remove(protectedId, req.GroupId) with
                    | Ok(model) ->
                        return (JsonResult(model) :> IActionResult)
                    | Error(ex) ->
                        logger.LogError(ex, "Cannot remove group from permissions")
                        return (BadRequestResult() :> IActionResult)
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("add_permissions_group")>]
    member this.AddPermissionsGroup
        ([<FromQuery(Name = "id")>] id: string,
        [<FromQuery(Name = "type")>] typeName: string,
        [<FromBody>] req: AddPermissionsGroupRequest) =
        async {
            let userId = this.GetUserId()

            match ProtectedId.Create(id, typeName) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot add group to permissions")
                return (BadRequestResult() :> IActionResult)

            | Ok(protectedId) ->
                match! permissionsService.CheckPermissions(protectedId, userId, AccessModel.CanAdministrate) with
                | Ok() ->
                    match! permissionsService.Add(protectedId, req.GroupId) with
                    | Ok(model) ->
                        return (JsonResult(model) :> IActionResult)
                    | Error(ex) ->
                        logger.LogError(ex, "Cannot add group to permissions")
                        return (BadRequestResult() :> IActionResult)
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("update_permissions_member")>]
    member this.UpdatePermissionMember
        ([<FromQuery(Name = "id")>] id: string,
        [<FromQuery(Name = "type")>] typeName: string,
        [<FromBody>] req: UpdateMemberRequest) =
        async {
            let userId = this.GetUserId()

            match ProtectedId.Create(id, typeName) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot update member in permissions")
                return (BadRequestResult() :> IActionResult)

            | Ok(protectedId) ->
                match! permissionsService.CheckPermissions(protectedId, userId, AccessModel.CanAdministrate) with
                | Ok() ->
                    match! permissionsService.Update(protectedId, req.UserId, req.Access) with
                    | Ok(model) ->
                        return (JsonResult(model) :> IActionResult)
                    | Error(ex) ->
                        logger.LogError(ex, "Cannot update member in permissions")
                        return (BadRequestResult() :> IActionResult)
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("remove_permissions_member")>]
    member this.RemovePermissionsMember
        ([<FromQuery(Name = "id")>] id: string,
        [<FromQuery(Name = "type")>] typeName: string,
        [<FromBody>] req: RemoveMemberRequest) =
        async {
            let userId = this.GetUserId()

            match ProtectedId.Create(id, typeName) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot remove member from permissions")
                return (BadRequestResult() :> IActionResult)
            | Ok(protectedId) ->
                match! permissionsService.CheckPermissions(protectedId, userId, AccessModel.CanAdministrate) with
                | Ok() ->
                    match! permissionsService.Remove(protectedId, req.UserId) with
                    | Ok(model) ->
                        return (JsonResult(model) :> IActionResult)
                    | Error(ex) ->
                        logger.LogError(ex, "Cannot remove member from permission")
                        return (BadRequestResult() :> IActionResult)
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("add_permissions_member")>]
    member this.AddPermissionsMember
        ([<FromQuery(Name = "id")>] id: string,
        [<FromQuery(Name = "type")>] typeName: string,
        [<FromBody>] req: AddMemberRequest) =
        async {
            let userId = this.GetUserId()

            match ProtectedId.Create(id, typeName) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot add member to permissions")
                return (BadRequestResult() :> IActionResult)

            | Ok(protectedId) ->
                match! permissionsService.CheckPermissions(protectedId, userId, AccessModel.CanAdministrate) with
                | Ok() ->
                    match! permissionsService.Add(protectedId, req.UserId) with
                    | Ok(model) ->
                        return (JsonResult(model) :> IActionResult)
                    | Error(ex) ->
                        logger.LogError(ex, "Cannot add member to persmissions")
                        return (BadRequestResult() :> IActionResult)
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask
