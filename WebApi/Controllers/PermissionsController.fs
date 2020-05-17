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

type UpdateGroupNameRequest = {
    [<JsonPropertyName("id")>]
    Id: GroupId
    [<JsonPropertyName("name")>]
    Name: GroupName
}

type UpdateGroupDescriptionRequest = {
    [<JsonPropertyName("id")>]
    Id: GroupId
    [<JsonPropertyName("description")>]
    Description: GroupDescription
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

[<Authorize>]
[<Route("permissions")>]
type PermissionsController(permissionsService: IPermissionsService,
                           logger: ILogger<PermissionsController>) =
    inherit ControllerBase()

    member private this.GetUserId() = UserId(this.User.FindFirst(ClaimTypes.NameIdentifier).Value)

    [<HttpPost>]
    [<Route("create_group")>]
    member this.CreateGroup([<FromBody>] req: CreateGroupRequest) =
        async {
            let userId = this.GetUserId()

            match! permissionsService.Create(userId, req.Name, req.Description) with
            | Ok(groupId) ->
                return (JsonResult(Id(groupId)) :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Cannot create group")
                return (BadRequestResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("group")>]
    member this.GetGroup([<FromQuery(Name = "id")>] id: string) =
        async {
            let groupId = GroupId(id)
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(groupId, userId, AccessModel.CanRead) with
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
            | Ok() ->
                match! permissionsService.Get(groupId) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot get group")
                    return (BadRequestResult() :> IActionResult)
                | Ok(model) ->
                    return (JsonResult(model) :> IActionResult)
        }

    [<HttpGet>]
    [<Route("groups")>]
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
    [<Route("update_group_name")>]
    member this.UpdateGroupName([<FromBody>] req: UpdateGroupNameRequest) =
        async {
            let userId = this.GetUserId()

            match! permissionsService.CheckPermissions(req.Id, userId, AccessModel.CanAdministrate) with
            | Ok() ->
                match! permissionsService.Update(req.Id, Some(req.Name), None) with
                | Ok(model) ->
                    return (JsonResult(model) :> IActionResult)
                | Error(ex) ->
                    logger.LogError(ex, "Cannot update group name")
                    return (BadRequestResult() :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("update_group_description")>]
    member this.UpdateGroupDescription([<FromBody>] req: UpdateGroupDescriptionRequest) =
        async {
            let userId = this.GetUserId()

            match! permissionsService.CheckPermissions(req.Id, userId, AccessModel.CanAdministrate) with
            | Ok() ->
                match! permissionsService.Update(req.Id, None, Some(req.Description)) with
                | Ok(model) ->
                    return (JsonResult(model) :> IActionResult)
                | Error(ex) ->
                    logger.LogError(ex, "Cannot update group description")
                    return (BadRequestResult() :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("update_group_member")>]
    member this.UpdateGroupMember([<FromBody>] req: UpdateGroupMemberRequest) =
        async {
            let userId = this.GetUserId()

            match! permissionsService.CheckPermissions(req.Id, userId, AccessModel.CanAdministrate) with
            | Ok() ->
                match! permissionsService.Update(req.Id, req.UserId, req.Access) with
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
    [<Route("remove_group_member")>]
    member this.RemoveGroupMember([<FromBody>] req: RemoveGroupMemberRequest) =
        async {
            let userId = this.GetUserId()

            match! permissionsService.CheckPermissions(req.Id, userId, AccessModel.CanAdministrate) with
            | Ok() ->
                match! permissionsService.Remove(req.Id, req.UserId) with
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
    [<Route("add_group_member")>]
    member this.AddGroupMember([<FromBody>] req: AddGroupMemberRequest) =
        async {
            let userId = this.GetUserId()

            match! permissionsService.CheckPermissions(req.Id, userId, AccessModel.CanAdministrate) with
            | Ok() ->
                match! permissionsService.Add(req.Id, req.UserId) with
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

    [<HttpGet>]
    [<Route("search_by_contains")>]
    member this.SearchByContains([<FromQuery(Name = "pattern")>] pattern: string) =
        async {
            match! permissionsService.SearchByContains(pattern) with
            | Error(ex) ->
                logger.LogError(ex, "Search failed")
                return (BadRequestResult() :> IActionResult)
            | Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask