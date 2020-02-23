namespace WebApi

open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Authorization
open Services.Permissions
open Models.Identificators
open System.Security.Claims
open System.Text.Json.Serialization
open Models.Permissions

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
type PermissionsController(permissionsService: IPermissionsService) =
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
            | Result.Error(fail) ->
                match fail with
                | CreateGroupFail.Error(_) ->
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
            | Result.Error(fail) ->
                match fail with
                | CheckPermissionsFail.Error(_) ->
                    return (BadRequestResult() :> IActionResult)
                | CheckPermissionsFail.Unauthorized() ->
                    return (UnauthorizedResult() :> IActionResult)
            | Ok() ->
                match! permissionsService.Get(groupId) with
                | Result.Error(fail) ->
                    match fail with
                    | GetGroupFail.Error(_) ->
                        return (BadRequestResult() :> IActionResult)
                | Ok(model) ->
                    return (JsonResult(model) :> IActionResult)
        }

    [<HttpGet>]
    [<Route("groups")>]
    member this.GetGroups() =
        async {
            let userId = this.GetUserId()
            match! permissionsService.Get(userId) with
            | Result.Error(fail) ->
                match fail with
                | GetGroupFail.Error(_) ->
                    return (BadRequestResult() :> IActionResult)
            | Ok(model) ->
                return (JsonResult(model) :> IActionResult)
        }

    [<HttpGet>]
    [<Route("permissions")>]
    member this.GetPermissions([<FromQuery(Name = "id")>] id: string, [<FromQuery(Name = "type")>] typeName: string) =
        async {
            match ProtectedId.Create(id, typeName) with
            | Result.Error() ->
                return (BadRequestResult() :> IActionResult)
            | Ok(protectedId) ->
                let userId = this.GetUserId()
                match! permissionsService.CheckPermissions(protectedId, userId, AccessModel.CanAdministrate) with
                | Result.Error(fail) ->
                    match fail with
                    | CheckPermissionsFail.Error(_) ->
                        return (BadRequestResult() :> IActionResult)
                    | CheckPermissionsFail.Unauthorized() ->
                        return (UnauthorizedResult() :> IActionResult)
                | Ok() ->
                    match! permissionsService.Get(protectedId) with
                    | Result.Error(fail) ->
                        match fail with
                        | GetPermissionsFail.Error(_) ->
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
                | Result.Error(fail) ->
                    match fail with
                    | UpdateGroupFail.Error(error) ->
                        return (BadRequestResult() :> IActionResult)
            | Result.Error(fail) ->
                match fail with
                | CheckPermissionsFail.Error(_) ->
                    return (BadRequestResult() :> IActionResult)
                | CheckPermissionsFail.Unauthorized() ->
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
                | Result.Error(fail) ->
                    match fail with
                    | UpdateGroupFail.Error(error) ->
                        return (BadRequestResult() :> IActionResult)
            | Result.Error(fail) ->
                match fail with
                | CheckPermissionsFail.Error(_) ->
                    return (BadRequestResult() :> IActionResult)
                | CheckPermissionsFail.Unauthorized() ->
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
                match! permissionsService.Update(req.Id, req.UserId, Some(req.Access)) with
                | Ok(model) ->
                    return (JsonResult(model) :> IActionResult)
                | Result.Error(fail) ->
                    match fail with
                    | UpdateGroupFail.Error(error) ->
                        return (BadRequestResult() :> IActionResult)
            | Result.Error(fail) ->
                match fail with
                | CheckPermissionsFail.Error(_) ->
                    return (BadRequestResult() :> IActionResult)
                | CheckPermissionsFail.Unauthorized() ->
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
                match! permissionsService.Update(req.Id, req.UserId, None) with
                | Ok(model) ->
                    return (JsonResult(model) :> IActionResult)
                | Result.Error(fail) ->
                    match fail with
                    | UpdateGroupFail.Error(error) ->
                        return (BadRequestResult() :> IActionResult)
            | Result.Error(fail) ->
                match fail with
                | CheckPermissionsFail.Error(_) ->
                    return (BadRequestResult() :> IActionResult)
                | CheckPermissionsFail.Unauthorized() ->
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
                | Result.Error(fail) ->
                    match fail with
                    | UpdateGroupFail.Error(error) ->
                        return (BadRequestResult() :> IActionResult)
            | Result.Error(fail) ->
                match fail with
                | CheckPermissionsFail.Error(_) ->
                    return (BadRequestResult() :> IActionResult)
                | CheckPermissionsFail.Unauthorized() ->
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
            | Result.Error() ->
                return (BadRequestResult() :> IActionResult)

            | Ok(protectedId) ->
                match! permissionsService.CheckPermissions(protectedId, userId, AccessModel.CanAdministrate) with
                | Ok() ->
                    match! permissionsService.Update(protectedId, req.GroupId, Some(req.Access)) with
                    | Ok(model) ->
                        return (JsonResult(model) :> IActionResult)
                    | Result.Error(fail) ->
                        match fail with
                        | UpdatePermissionsFail.Error(error) ->
                            return (BadRequestResult() :> IActionResult)
                | Result.Error(fail) ->
                    match fail with
                    | CheckPermissionsFail.Error(_) ->
                        return (BadRequestResult() :> IActionResult)
                    | CheckPermissionsFail.Unauthorized() ->
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
            | Result.Error() ->
                return (BadRequestResult() :> IActionResult)

            | Ok(protectedId) ->
                match! permissionsService.CheckPermissions(protectedId, userId, AccessModel.CanAdministrate) with
                | Ok() ->
                    match! permissionsService.Update(protectedId, req.GroupId, None) with
                    | Ok(model) ->
                        return (JsonResult(model) :> IActionResult)
                    | Result.Error(fail) ->
                        match fail with
                        | UpdatePermissionsFail.Error(error) ->
                            return (BadRequestResult() :> IActionResult)
                | Result.Error(fail) ->
                    match fail with
                    | CheckPermissionsFail.Error(_) ->
                        return (BadRequestResult() :> IActionResult)
                    | CheckPermissionsFail.Unauthorized() ->
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
            | Result.Error() ->
                return (BadRequestResult() :> IActionResult)

            | Ok(protectedId) ->
                match! permissionsService.CheckPermissions(protectedId, userId, AccessModel.CanAdministrate) with
                | Ok() ->
                    match! permissionsService.Add(protectedId, req.GroupId) with
                    | Ok(model) ->
                        return (JsonResult(model) :> IActionResult)
                    | Result.Error(fail) ->
                        match fail with
                        | UpdatePermissionsFail.Error(error) ->
                            return (BadRequestResult() :> IActionResult)
                | Result.Error(fail) ->
                    match fail with
                    | CheckPermissionsFail.Error(_) ->
                        return (BadRequestResult() :> IActionResult)
                    | CheckPermissionsFail.Unauthorized() ->
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
            | Result.Error() ->
                return (BadRequestResult() :> IActionResult)

            | Ok(protectedId) ->
                match! permissionsService.CheckPermissions(protectedId, userId, AccessModel.CanAdministrate) with
                | Ok() ->
                    match! permissionsService.Update(protectedId, req.UserId, Some(req.Access)) with
                    | Ok(model) ->
                        return (JsonResult(model) :> IActionResult)
                    | Result.Error(fail) ->
                        match fail with
                        | UpdatePermissionsFail.Error(error) ->
                            return (BadRequestResult() :> IActionResult)
                | Result.Error(fail) ->
                    match fail with
                    | CheckPermissionsFail.Error(_) ->
                        return (BadRequestResult() :> IActionResult)
                    | CheckPermissionsFail.Unauthorized() ->
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
            | Result.Error() ->
                return (BadRequestResult() :> IActionResult)

            | Ok(protectedId) ->
                match! permissionsService.CheckPermissions(protectedId, userId, AccessModel.CanAdministrate) with
                | Ok() ->
                    match! permissionsService.Update(protectedId, req.UserId, None) with
                    | Ok(model) ->
                        return (JsonResult(model) :> IActionResult)
                    | Result.Error(fail) ->
                        match fail with
                        | UpdatePermissionsFail.Error(error) ->
                            return (BadRequestResult() :> IActionResult)
                | Result.Error(fail) ->
                    match fail with
                    | CheckPermissionsFail.Error(_) ->
                        return (BadRequestResult() :> IActionResult)
                    | CheckPermissionsFail.Unauthorized() ->
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
            | Result.Error() ->
                return (BadRequestResult() :> IActionResult)

            | Ok(protectedId) ->
                match! permissionsService.CheckPermissions(protectedId, userId, AccessModel.CanAdministrate) with
                | Ok() ->
                    match! permissionsService.Add(protectedId, req.UserId) with
                    | Ok(model) ->
                        return (JsonResult(model) :> IActionResult)
                    | Result.Error(fail) ->
                        match fail with
                        | UpdatePermissionsFail.Error(error) ->
                            return (BadRequestResult() :> IActionResult)
                | Result.Error(fail) ->
                    match fail with
                    | CheckPermissionsFail.Error(_) ->
                        return (BadRequestResult() :> IActionResult)
                    | CheckPermissionsFail.Unauthorized() ->
                        return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask