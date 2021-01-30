namespace Facade

open Microsoft.AspNetCore.Authorization
open GrpcGroups
open Models.Permissions
open Services.Folders
open Services.Permissions
open Microsoft.Extensions.Logging
open DatabaseTypes.Identificators
open Grpc.Core
open System.Security.Claims
open Domain
open Models.Folders
open Models.Permissions
open Models.Heads
open Utils.ResultHelper
open FSharp.Control
open System

[<Authorize(Roles="admin")>]
type GroupsApi(permissionsService: IPermissionsService,
               groupService: IGroupService,
               logger: ILogger<GroupsApi>) =
    inherit GrpcGroups.GroupsService.GroupsServiceBase()

    member private this.GetUserId(context: ServerCallContext) = UserId(context.GetHttpContext().User.FindFirst(ClaimTypes.NameIdentifier).Value)

    override this.CreateGroup(request, context) =
        async {
            let userId = this.GetUserId(context)
            let name = GroupName(request.Name)
            let description = GroupDescription(request.Description)

            match! groupService.Create(userId, name, description) with
            | Ok(groupId) ->
                let reply = CreateGroupReply()
                reply.GroupId <- groupId.Value
                return reply
            | Error(ex) ->
                logger.LogError(ex, "Cannot create group")
                let error = CreateGroupReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- CreateGroupReply.Types.Error.Types.Status.Unknown
                let reply = CreateGroupReply()
                reply.Error <- error
                return reply
        }
        |> Async.StartAsTask

    override this.GetGroup(request, context) =
        async {
            let groupId = GroupId(request.GroupId)
            let userId = this.GetUserId(context)
            match! permissionsService.CheckPermissions(groupId, userId, AccessModel.CanRead) with
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                let error = GetGroupReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- GetGroupReply.Types.Error.Types.Status.NoAccess
                let reply = GetGroupReply()
                reply.Error <- error
                return reply
            | Ok() ->
                match! groupService.Get(groupId) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot get group")
                    let error = GetGroupReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- GetGroupReply.Types.Error.Types.Status.Unknown
                    let reply = GetGroupReply()
                    reply.Error <- error
                    return reply
                | Ok(model) ->
                    let reply = GetGroupReply()
                    reply.Group <- Converter.Convert(model)
                    return reply
        } |> Async.StartAsTask

    override this.GetGroups(request, context) =
        async {
            let userId = this.GetUserId(context)
            let access =
                {
                    AccessModel.Admin = request.Admin
                    Read = request.Read
                    Write = request.Write
                    Generate = request.Generate
                }
            match! permissionsService.Get(userId, access) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot fetch groups")
                let error = GetGroupsReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- GetGroupsReply.Types.Error.Types.Status.Unknown
                let reply = GetGroupsReply()
                reply.Error <- error
                return reply
            | Ok(model) ->
                let groups = GetGroupsReply.Types.GroupList()
                Converter.Convert(model, groups.Groups, Converter.Convert)
                let reply = GetGroupsReply()
                reply.Groups <- groups
                return reply
        } |> Async.StartAsTask

    override this.UpdateGroup(request, context) =
        async {
            let userId = this.GetUserId(context)
            let groupId = GroupId(request.GroupId)
            let name =
                match request.Name with
                | null -> None
                | x -> Some(GroupName(x))
            let description =
                match request.Description with
                | null -> None
                | x -> Some(GroupDescription(x))

            match! permissionsService.CheckPermissions(groupId, userId, AccessModel.CanAdministrate) with
            | Ok() ->
                match! groupService.Update(groupId, name, description) with
                | Ok(model) ->
                    return UpdateGroupReply()
                | Error(ex) ->
                    logger.LogError(ex, "Cannot update group")
                    let error = UpdateGroupReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- UpdateGroupReply.Types.Error.Types.Status.Unknown
                    let reply = UpdateGroupReply()
                    reply.Error <- error
                    return reply
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                let error = UpdateGroupReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- UpdateGroupReply.Types.Error.Types.Status.NoAccess
                let reply = UpdateGroupReply()
                reply.Error <- error
                return reply
        }
        |> Async.StartAsTask

    override this.UpdateMember(request, context) =
        async {
            let userId = this.GetUserId(context)
            let groupId = GroupId(request.GroupId)
            let targetUserId = UserId(request.UserId)

            match request.Access with
            | null ->
                let ex = ArgumentNullException("request.Access")
                logger.LogError(ex, "Cannot group update member")
                let error = UpdateMemberReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- UpdateMemberReply.Types.Error.Types.Status.Unknown
                let reply = UpdateMemberReply()
                reply.Error <- error
                return reply
            | ac ->
                let access = BackConverter.Convert(ac)
                match! permissionsService.CheckPermissions(groupId, userId, AccessModel.CanAdministrate) with
                | Ok() ->
                    match! groupService.Update(groupId, targetUserId, access) with
                    | Ok(model) ->
                        return UpdateMemberReply()
                    | Error(ex) ->
                        logger.LogError(ex, "Cannot update group member")
                        let error = UpdateMemberReply.Types.Error()
                        error.Description <- ex.Message
                        error.Status <- UpdateMemberReply.Types.Error.Types.Status.Unknown
                        let reply = UpdateMemberReply()
                        reply.Error <- error
                        return reply
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    let error = UpdateMemberReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- UpdateMemberReply.Types.Error.Types.Status.NoAccess
                    let reply = UpdateMemberReply()
                    reply.Error <- error
                    return reply
        }
        |> Async.StartAsTask

    override this.RemoveMembers(request, context) =
        async {
            let userId = this.GetUserId(context)
            let groupId = GroupId(request.GroupId)
            let! hasAccess =
                async {
                    match! permissionsService.CheckPermissions(groupId, userId, AccessModel.CanAdministrate) with
                    | Ok() ->
                        return true
                    | Error(ex) ->
                        logger.LogError(ex, "Access denied")
                        return false
                }
                
            let reply = RemoveMembersReply()

            request.Users
            |> AsyncSeq.ofSeq
            |> AsyncSeq.mapAsync(fun id ->
                async {
                    let entry = RemoveMembersReply.Types.UserEntry()
                    entry.UserId <- id
                    let userId = UserId(id)
                    if hasAccess then
                        let userId = UserId(id)
                        match! groupService.Remove(groupId, userId) with
                        | Ok(model) -> entry.Status <- RemoveMembersReply.Types.Status.Ok
                        | Error(ex) ->
                            logger.LogError(ex, "Cannot remove group member")
                            entry.Status <- RemoveMembersReply.Types.Status.Unknown
                    else
                        entry.Status <- RemoveMembersReply.Types.Status.NoAccess
                    return entry
                }
            )
            |> AsyncSeq.iter(fun entry ->
                reply.Users.Add(entry)
            )
            |> Async.RunSynchronously

            return reply
        }
        |> Async.StartAsTask

    override this.AddMembers(request, context) =
        async {
            let userId = this.GetUserId(context)
            let groupId = GroupId(request.GroupId)
            let! hasAccess =
                async {
                    match! permissionsService.CheckPermissions(groupId, userId, AccessModel.CanAdministrate) with
                    | Ok() ->
                        return true
                    | Error(ex) ->
                        logger.LogError(ex, "Access denied")
                        return false
                }
                
            let reply = AddMembersReply()

            request.Users
            |> AsyncSeq.ofSeq
            |> AsyncSeq.mapAsync(fun id ->
                async {
                    let entry = AddMembersReply.Types.UserEntry()
                    entry.UserId <- id
                    let userId = UserId(id)
                    if hasAccess then
                        let userId = UserId(id)
                        match! groupService.Add(groupId, userId) with
                        | Ok(model) -> entry.Status <- AddMembersReply.Types.Status.Ok
                        | Error(ex) ->
                            logger.LogError(ex, "Cannot add group member")
                            entry.Status <- AddMembersReply.Types.Status.Unknown
                    else
                        entry.Status <- AddMembersReply.Types.Status.NoAccess
                    return entry
                }
            )
            |> AsyncSeq.iter(fun entry ->
                reply.Users.Add(entry)
            )
            |> Async.RunSynchronously

            return reply
        }
        |> Async.StartAsTask

    override this.Search(request, context) =
        async {
            let pattern =
                match request.Pattern with
                | null -> None
                | x -> Some(x)
            match! groupService.Search(pattern, request.Offset, request.Limit) with
            | Error(ex) ->
                logger.LogError(ex, "Search failed")
                let error = SearchReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- SearchReply.Types.Error.Types.Status.Unknown
                let reply = SearchReply()
                reply.Error <- error
                return reply
            | Ok(model) ->
                let groups = SearchReply.Types.GroupList()
                Converter.Convert(model, groups.Groups, Converter.Convert)
                let reply = SearchReply()
                reply.Groups <- groups
                return reply
        }
        |> Async.StartAsTask