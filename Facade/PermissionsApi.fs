namespace Facade

open Microsoft.AspNetCore.Authorization
open GrpcPermissions
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
type PermissionsApi(permissionsService: IPermissionsService,
                    logger: ILogger<PermissionsApi>) =
    inherit GrpcPermissions.PermissionsService.PermissionsServiceBase()

    member private this.GetUserId(context: ServerCallContext) = UserId(context.GetHttpContext().User.FindFirst(ClaimTypes.NameIdentifier).Value)

    override this.GetPermissions(request, context) =
        async {
            match BackConverter.Convert(request.Item) with
            | None ->
                let ex = ArgumentNullException("request.Item")
                logger.LogError(ex, "Missing Item field")
                let error = GetPermissionsReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- GetPermissionsReply.Types.Error.Types.Status.WrongRequest
                let reply = GetPermissionsReply()
                reply.Error <- error
                return reply
            | Some(protectedId) ->
                let userId = this.GetUserId(context)
                match! permissionsService.CheckPermissions(protectedId, userId, AccessModel.CanAdministrate) with
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    let error = GetPermissionsReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- GetPermissionsReply.Types.Error.Types.Status.NoAccess
                    let reply = GetPermissionsReply()
                    reply.Error <- error
                    return reply
                | Ok() ->
                    match! permissionsService.Get(protectedId) with
                    | Error(ex) ->
                        logger.LogError(ex, "Cannot get permissions")
                        let error = GetPermissionsReply.Types.Error()
                        error.Description <- ex.Message
                        error.Status <- GetPermissionsReply.Types.Error.Types.Status.Unknown
                        let reply = GetPermissionsReply()
                        reply.Error <- error
                        return reply
                    | Ok(model) ->
                        let reply = GetPermissionsReply()
                        reply.Permissions <- Converter.Convert(model)
                        return reply
        } |> Async.StartAsTask

    override this.SetIsPublic(request, context) =
        async {
            match BackConverter.Convert(request.ProtectedItem) with
            | None ->
                let ex = ArgumentException("Wrong request.Item")
                logger.LogError(ex, "Cannot get permissions")
                let error = SetIsPublicReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- SetIsPublicReply.Types.Error.Types.Status.WrongRequest
                let reply = SetIsPublicReply()
                reply.Error <- error
                return reply
            | Some(protectedId) ->
                let userId = this.GetUserId(context)
                match! permissionsService.CheckPermissions(protectedId, userId, AccessModel.CanAdministrate) with
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    let error = SetIsPublicReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- SetIsPublicReply.Types.Error.Types.Status.NoAccess
                    let reply = SetIsPublicReply()
                    reply.Error <- error
                    return reply
                | Ok() ->
                    match! permissionsService.SetIsPublic(protectedId, request.IsPublic) with
                    | Error(ex) ->
                        logger.LogError(ex, "Cannot set is public")
                        let error = SetIsPublicReply.Types.Error()
                        error.Description <- ex.Message
                        error.Status <- SetIsPublicReply.Types.Error.Types.Status.Unknown
                        let reply = SetIsPublicReply()
                        reply.Error <- error
                        return reply
                    | Ok(model) ->
                        return SetIsPublicReply()
        } |> Async.StartAsTask

    override this.GetAccessInfo(request, context) =
        async {
            let reply = GetAccessInfoReply()
            request.ProtectedItems
            |> AsyncSeq.ofSeq
            |> AsyncSeq.mapAsync(fun protectedItem ->
                async {
                    match BackConverter.Convert(protectedItem) with
                    | None ->
                        return (protectedItem.Id, AccessModel.CanNothing)
                    | Some(protectedId) ->
                        let userId = this.GetUserId(context)
                        match! permissionsService.Get(userId, protectedId) with
                        | Error(ex) ->
                            logger.LogError(ex, "Cannot get access model")
                            return (protectedItem.Id, AccessModel.CanNothing)
                        | Ok(model) ->
                            return (protectedItem.Id, model)
                }
            )
            |> AsyncSeq.iter(fun (id, access) ->
                reply.Access.Add(id, Converter.Convert(access))
            )
            |> Async.RunSynchronously

            return reply
        } |> Async.StartAsTask

    override this.UpdatePermissions(request, context) =
        async {
            let userId = this.GetUserId(context)
            let reply = UpdatePermissionsReply()
            match BackConverter.Convert(request.ProtectedItem) with
            | None ->
                let ex = ArgumentException("Incorrect request.ProtectedItem")
                logger.LogError(ex, "Cannot update group permissions")
                request.Users
                |> Seq.iter(fun userEntry ->
                    let entry = UpdatePermissionsReply.Types.UserEntry()
                    entry.UserId <- userEntry.UserId
                    entry.Status <- UpdatePermissionsReply.Types.Status.ItemNotFound
                    reply.Users.Add(entry)
                )
                request.Groups
                |> Seq.iter(fun groupEntry ->
                    let entry = UpdatePermissionsReply.Types.GroupEntry()
                    entry.GroupId <- groupEntry.GroupId
                    entry.Status <- UpdatePermissionsReply.Types.Status.ItemNotFound
                    reply.Groups.Add(entry)
                )
            | Some(protectedId) ->
                match! permissionsService.CheckPermissions(protectedId, userId, AccessModel.CanAdministrate) with
                | Ok() ->
                    request.Users
                    |> AsyncSeq.ofSeq
                    |> AsyncSeq.iterAsync(fun userEntry ->
                        async {
                            let memberId = UserId(userEntry.UserId)
                            let access = BackConverter.Convert(userEntry.Access)
                            let entry = UpdatePermissionsReply.Types.UserEntry()
                            entry.UserId <- userEntry.UserId
                            match! permissionsService.Update(protectedId, memberId, access) with
                            | Ok(_) ->
                                entry.Status <- UpdatePermissionsReply.Types.Status.Ok
                            | Error(ex) ->
                                entry.Status <- UpdatePermissionsReply.Types.Status.Unknown
                            reply.Users.Add(entry)
                        }
                    )
                    |> Async.RunSynchronously

                    request.Groups
                    |> AsyncSeq.ofSeq
                    |> AsyncSeq.iterAsync(fun groupEntry ->
                        async {
                            let groupId = GroupId(groupEntry.GroupId)
                            let access = BackConverter.Convert(groupEntry.Access)
                            let entry = UpdatePermissionsReply.Types.GroupEntry()
                            entry.GroupId <- groupEntry.GroupId
                            match! permissionsService.Update(protectedId, groupId, access) with
                            | Ok(_) ->
                                entry.Status <- UpdatePermissionsReply.Types.Status.Ok
                            | Error(ex) ->
                                entry.Status <- UpdatePermissionsReply.Types.Status.Unknown
                            reply.Groups.Add(entry)
                        }
                    )
                    |> Async.RunSynchronously
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    request.Users
                    |> Seq.iter(fun userEntry ->
                        let entry = UpdatePermissionsReply.Types.UserEntry()
                        entry.UserId <- userEntry.UserId
                        entry.Status <- UpdatePermissionsReply.Types.Status.NoAccess
                        reply.Users.Add(entry)
                    )
                    request.Groups
                    |> Seq.iter(fun groupEntry ->
                        let entry = UpdatePermissionsReply.Types.GroupEntry()
                        entry.GroupId <- groupEntry.GroupId
                        entry.Status <- UpdatePermissionsReply.Types.Status.NoAccess
                        reply.Groups.Add(entry)
                    )

            return reply
        }
        |> Async.StartAsTask

    override this.AddMembers(request, context) =
        async {
            let userId = this.GetUserId(context)
            let reply = AddMembersReply()
            match BackConverter.Convert(request.ProtectedItem) with
            | None ->
                let ex = ArgumentException("Incorrect request.ProtectedItem")
                logger.LogError(ex, "Cannot add members")
                request.Users
                |> Seq.iter(fun id ->
                    let entry = AddMembersReply.Types.UserEntry()
                    entry.UserId <- id
                    entry.Status <- AddMembersReply.Types.Status.ItemNotFound
                    reply.Users.Add(entry)
                )
                request.Groups
                |> Seq.iter(fun id ->
                    let entry = AddMembersReply.Types.GroupEntry()
                    entry.GroupId <- id
                    entry.Status <- AddMembersReply.Types.Status.ItemNotFound
                    reply.Groups.Add(entry)
                )
            | Some(protectedId) ->
                match! permissionsService.CheckPermissions(protectedId, userId, AccessModel.CanAdministrate) with
                | Ok() ->
                    request.Users
                    |> AsyncSeq.ofSeq
                    |> AsyncSeq.iterAsync(fun id ->
                        async {
                            let memberId = UserId(id)
                            let entry = AddMembersReply.Types.UserEntry()
                            entry.UserId <- id
                            match! permissionsService.Add(protectedId, memberId) with
                            | Ok(_) ->
                                entry.Status <- AddMembersReply.Types.Status.Ok
                            | Error(ex) ->
                                entry.Status <- AddMembersReply.Types.Status.Unknown
                            reply.Users.Add(entry)
                        }
                    )
                    |> Async.RunSynchronously

                    request.Groups
                    |> AsyncSeq.ofSeq
                    |> AsyncSeq.iterAsync(fun id ->
                        async {
                            let groupId = GroupId(id)
                            let entry = AddMembersReply.Types.GroupEntry()
                            entry.GroupId <- id
                            match! permissionsService.Add(protectedId, groupId) with
                            | Ok(_) ->
                                entry.Status <- AddMembersReply.Types.Status.Ok
                            | Error(ex) ->
                                entry.Status <- AddMembersReply.Types.Status.Unknown
                            reply.Groups.Add(entry)
                        }
                    )
                    |> Async.RunSynchronously
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    request.Users
                    |> Seq.iter(fun id ->
                        let entry = AddMembersReply.Types.UserEntry()
                        entry.UserId <- id
                        entry.Status <- AddMembersReply.Types.Status.NoAccess
                        reply.Users.Add(entry)
                    )
                    request.Groups
                    |> Seq.iter(fun id ->
                        let entry = AddMembersReply.Types.GroupEntry()
                        entry.GroupId <- id
                        entry.Status <- AddMembersReply.Types.Status.NoAccess
                        reply.Groups.Add(entry)
                    )

            return reply
        }
        |> Async.StartAsTask

    override this.RemoveMembers(request, context) =
        async {
            let userId = this.GetUserId(context)
            let reply = RemoveMembersReply()
            match BackConverter.Convert(request.ProtectedItem) with
            | None ->
                let ex = ArgumentException("Incorrect request.ProtectedItem")
                logger.LogError(ex, "Cannot remove members")
                request.Users
                |> Seq.iter(fun id ->
                    let entry = RemoveMembersReply.Types.UserEntry()
                    entry.UserId <- id
                    entry.Status <- RemoveMembersReply.Types.Status.ItemNotFound
                    reply.Users.Add(entry)
                )
                request.Groups
                |> Seq.iter(fun id ->
                    let entry = RemoveMembersReply.Types.GroupEntry()
                    entry.GroupId <- id
                    entry.Status <- RemoveMembersReply.Types.Status.ItemNotFound
                    reply.Groups.Add(entry)
                )
            | Some(protectedId) ->
                match! permissionsService.CheckPermissions(protectedId, userId, AccessModel.CanAdministrate) with
                | Ok() ->
                    request.Users
                    |> AsyncSeq.ofSeq
                    |> AsyncSeq.iterAsync(fun id ->
                        async {
                            let memberId = UserId(id)
                            let entry = RemoveMembersReply.Types.UserEntry()
                            entry.UserId <- id
                            match! permissionsService.Remove(protectedId, memberId) with
                            | Ok(_) ->
                                entry.Status <- RemoveMembersReply.Types.Status.Ok
                            | Error(ex) ->
                                entry.Status <- RemoveMembersReply.Types.Status.Unknown
                            reply.Users.Add(entry)
                        }
                    )
                    |> Async.RunSynchronously

                    request.Groups
                    |> AsyncSeq.ofSeq
                    |> AsyncSeq.iterAsync(fun id ->
                        async {
                            let groupId = GroupId(id)
                            let entry = RemoveMembersReply.Types.GroupEntry()
                            entry.GroupId <- id
                            match! permissionsService.Remove(protectedId, groupId) with
                            | Ok(_) ->
                                entry.Status <- RemoveMembersReply.Types.Status.Ok
                            | Error(ex) ->
                                entry.Status <- RemoveMembersReply.Types.Status.Unknown
                            reply.Groups.Add(entry)
                        }
                    )
                    |> Async.RunSynchronously
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    request.Users
                    |> Seq.iter(fun id ->
                        let entry = RemoveMembersReply.Types.UserEntry()
                        entry.UserId <- id
                        entry.Status <- RemoveMembersReply.Types.Status.NoAccess
                        reply.Users.Add(entry)
                    )
                    request.Groups
                    |> Seq.iter(fun id ->
                        let entry = RemoveMembersReply.Types.GroupEntry()
                        entry.GroupId <- id
                        entry.Status <- RemoveMembersReply.Types.Status.NoAccess
                        reply.Groups.Add(entry)
                    )

            return reply
        }
        |> Async.StartAsTask
