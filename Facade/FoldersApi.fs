namespace Facade

open Microsoft.AspNetCore.Authorization
open GrpcFolders
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

[<Authorize>]
type FoldersApi(foldersService: IFoldersService,
                permissionsService: IPermissionsService,
                logger: ILogger<FoldersApi>) =
    inherit GrpcFolders.FoldersService.FoldersServiceBase()

    member private this.GetUserId(context: ServerCallContext) = UserId(context.GetHttpContext().User.FindFirst(ClaimTypes.NameIdentifier).Value)

    override this.GetFolder(request, context) =
        async {
            let userId = this.GetUserId(context)
            let folderId = FolderId(request.FolderId)
            match! permissionsService.CheckPermissions(ProtectedId.Folder(folderId), userId, AccessModel.CanRead) with
            | Ok() ->
                match! foldersService.Get(folderId) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot get folder")
                    let error = GetFolderReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- GetFolderReply.Types.Error.Types.Status.Unknown
                    let reply = GetFolderReply()
                    reply.Error <- error
                    return reply
                | Ok(model) ->
                    let reply = GetFolderReply()
                    reply.Folder <- Converter.Convert(model)
                    return reply
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                let error = GetFolderReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- GetFolderReply.Types.Error.Types.Status.NoAccess
                let reply = GetFolderReply()
                reply.Error <- error
                return reply
        }
        |> Async.StartAsTask

    override this.CreateFolder(request, context) =
        async {
            let userId = this.GetUserId(context)
            let destinationId = FolderId(request.DestinationId)

            match! permissionsService.CheckPermissions(ProtectedId.Folder(destinationId), userId, AccessModel.CanWrite) with
            | Ok() ->
                let! result =
                    foldersService.Create(FolderName(request.Name), userId)
                    |> Async.BindResult(fun folderId ->
                        foldersService.Add(folderId, destinationId)
                        |> Async.MapResult(fun _ -> folderId)
                    )
                match result with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot create folder")
                    let error = CreateFolderReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- CreateFolderReply.Types.Error.Types.Status.Unknown
                    let reply = CreateFolderReply()
                    reply.Error <- error
                    return reply
                | Ok(model) ->
                    let reply = CreateFolderReply()
                    reply.NewFolderId <- model.Value
                    return reply
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                let error = CreateFolderReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- CreateFolderReply.Types.Error.Types.Status.NoAccess
                let reply = CreateFolderReply()
                reply.Error <- error
                return reply
        }
        |> Async.StartAsTask

    override this.GetRoot(reuqest, context) =
        async {
            let userId = this.GetUserId(context)
            let! result = foldersService.GetRoot(userId)
            match result with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get root")
                let error = GetRootReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- GetRootReply.Types.Error.Types.Status.Unknown
                let reply = GetRootReply()
                reply.Error <- error
                return reply
            | Ok(model) ->
                let reply = GetRootReply()
                reply.Folder <- Converter.Convert(model)
                return reply
        }
        |> Async.StartAsTask

    override this.GetTrash(request, context) =
        async {
            let userId = this.GetUserId(context)
            let! result = foldersService.GetTrash(userId)
            match result with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get trash")
                let error = GetTrashReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- GetTrashReply.Types.Error.Types.Status.Unknown
                let reply = GetTrashReply()
                reply.Error <- error
                return reply
            | Ok(model) ->
                let reply = GetTrashReply()
                reply.Trash <- Converter.Convert(model)
                return reply
        }
        |> Async.StartAsTask

    override this.MoveToTrash(request, context) =
        async {
            let userId = this.GetUserId(context)
            let reply = MoveToTrashReply()

            let headsAsync =
                request.Heads
                |> AsyncSeq.ofSeq
                |> AsyncSeq.mapAsync(fun headEntry ->
                    async {
                        let parentId = FolderId(headEntry.ParentId)
                        let headId = HeadId(headEntry.HeadId)
                        let result = MoveToTrashReply.Types.HeadEntry()
                        result.HeadId <- headEntry.HeadId
                        match! permissionsService.CheckPermissions(ProtectedId.Head(headId), userId, AccessModel.CanWrite) with
                        | Ok() ->
                            match! foldersService.MoveToTrash(parentId, headId, userId) with
                            | Error(ex) ->
                                logger.LogError(ex, "Cannot move head to trash")
                                result.Status <- MoveToTrashReply.Types.Status.Unknown
                                return result
                            | Ok() ->
                                result.Status <- MoveToTrashReply.Types.Status.Ok
                                return result
                        | Error(ex) ->
                            logger.LogError(ex, "Access denied")
                            result.Status <- MoveToTrashReply.Types.Status.NoAccess
                            return result
                    }
                )
                |> AsyncSeq.iter(fun entry ->
                    reply.Heads.Add(entry)
                )

            let foldersAsync =
                request.Folders
                |> AsyncSeq.ofSeq
                |> AsyncSeq.mapAsync(fun folderEntry ->
                    async {
                        let parentId = FolderId(folderEntry.ParentId)
                        let folderId = FolderId(folderEntry.FolderId)
                        let result = MoveToTrashReply.Types.FolderEntry()
                        result.FolderId <- folderEntry.FolderId
                        match! permissionsService.CheckPermissions(ProtectedId.Folder(folderId), userId, AccessModel.CanWrite) with
                        | Ok() ->
                            match! foldersService.MoveToTrash(parentId, folderId, userId) with
                            | Error(ex) ->
                                logger.LogError(ex, "Cannot move head to trash")
                                result.Status <- MoveToTrashReply.Types.Status.Unknown
                                return result
                            | Ok() ->
                                result.Status <- MoveToTrashReply.Types.Status.Ok
                                return result
                        | Error(ex) ->
                            logger.LogError(ex, "Access denied")
                            result.Status <- MoveToTrashReply.Types.Status.NoAccess
                            return result
                    }
                )
                |> AsyncSeq.iter(fun entry ->
                    reply.Folders.Add(entry)
                )

            [ headsAsync; foldersAsync]
            |> Async.Parallel
            |> Async.RunSynchronously
            |> ignore

            return reply
        }
        |> Async.StartAsTask


    override this.RestoreFromTrash(request, context) =
        async {
            let userId = this.GetUserId(context)
            let reply = RestoreFromTrashReply()

            let headsAsync =
                request.Heads
                |> AsyncSeq.ofSeq
                |> AsyncSeq.mapAsync(fun id ->
                    async {
                        let headId = HeadId(id)
                        let result = RestoreFromTrashReply.Types.HeadEntry()
                        result.HeadId <- id
                        match! permissionsService.CheckPermissions(ProtectedId.Head(headId), userId, AccessModel.CanWrite) with
                        | Ok() ->
                            match! foldersService.Restore(headId, userId) with
                            | Error(ex) ->
                                logger.LogError(ex, "Cannot restore head from trash")
                                result.Status <- RestoreFromTrashReply.Types.Status.Unknown
                                return result
                            | Ok() ->
                                result.Status <- RestoreFromTrashReply.Types.Status.Ok
                                return result
                        | Error(ex) ->
                            logger.LogError(ex, "Access denied")
                            result.Status <- RestoreFromTrashReply.Types.Status.NoAccess
                            return result
                    }
                )
                |> AsyncSeq.iter(fun entry ->
                    reply.Heads.Add(entry)
                )

            let foldersAsync =
                request.Folders
                |> AsyncSeq.ofSeq
                |> AsyncSeq.mapAsync(fun id ->
                    async {
                        let folderId = FolderId(id)
                        let result = RestoreFromTrashReply.Types.FolderEntry()
                        result.FolderId <- id
                        match! permissionsService.CheckPermissions(ProtectedId.Folder(folderId), userId, AccessModel.CanWrite) with
                        | Ok() ->
                            match! foldersService.Restore(folderId, userId) with
                            | Error(ex) ->
                                logger.LogError(ex, "Cannot restore folder from trash")
                                result.Status <- RestoreFromTrashReply.Types.Status.Unknown
                                return result
                            | Ok() ->
                                result.Status <- RestoreFromTrashReply.Types.Status.Ok
                                return result
                        | Error(ex) ->
                            logger.LogError(ex, "Access denied")
                            result.Status <- RestoreFromTrashReply.Types.Status.NoAccess
                            return result
                    }
                )
                |> AsyncSeq.iter(fun entry ->
                    reply.Folders.Add(entry)
                )

            [ headsAsync; foldersAsync]
            |> Async.Parallel
            |> Async.RunSynchronously
            |> ignore

            return reply
        }
        |> Async.StartAsTask

    override this.Move(request, context) =
        async {
            let userId = this.GetUserId(context)
            let sourceId = FolderId(request.SourceId)
            let destinationId = FolderId(request.DestinationId)
            let permissionsResult =
                seq {
                    permissionsService.CheckPermissions(ProtectedId.Folder(sourceId), userId, AccessModel.CanWrite)
                    permissionsService.CheckPermissions(ProtectedId.Folder(destinationId), userId, AccessModel.CanWrite)
                    match request.TargetCase with
                    | MoveRequest.TargetOneofCase.HeadId ->
                        permissionsService.CheckPermissions(ProtectedId.Head(HeadId(request.HeadId)), userId, AccessModel.CanWrite)
                    | MoveRequest.TargetOneofCase.FolderId ->
                        permissionsService.CheckPermissions(ProtectedId.Folder(FolderId(request.FolderId)), userId, AccessModel.CanWrite)
                    | _ -> async.Return(Ok())
                }
                |> ResultOfAsyncSeq
            match! permissionsResult with
            | Ok(_) ->
                let result =
                    match request.TargetCase with
                    | MoveRequest.TargetOneofCase.HeadId ->
                        foldersService.Move(HeadId(request.HeadId), sourceId, destinationId)
                    | MoveRequest.TargetOneofCase.FolderId ->
                        foldersService.Move(FolderId(request.FolderId), sourceId, destinationId)
                    | _ -> async.Return(Ok())
                    
                match! result with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot move")
                    let error = MoveReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- MoveReply.Types.Error.Types.Status.Unknown
                    let reply = MoveReply()
                    reply.Error <- error
                    return reply
                | Ok(model) ->
                    return MoveReply()
            | Error(ex) ->
                logger.LogError(ex,"Access denied")
                let error = MoveReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- MoveReply.Types.Error.Types.Status.NoAccess
                let reply = MoveReply()
                reply.Error <- error
                return reply
        }
        |> Async.StartAsTask

    override this.Rename(request, context) =
        async {
            let userId = this.GetUserId(context)
            let! permissionsResult =
                match request.TargetCase with
                | RenameRequest.TargetOneofCase.HeadId ->
                    permissionsService.CheckPermissions(ProtectedId.Head(HeadId(request.HeadId)), userId, AccessModel.CanWrite)
                | RenameRequest.TargetOneofCase.FolderId ->
                    permissionsService.CheckPermissions(ProtectedId.Folder(FolderId(request.FolderId)), userId, AccessModel.CanWrite)
                | _ -> async.Return(Ok())
            match permissionsResult with
            | Ok() ->
                let parentId = FolderId(request.ParentId)
                let! result =
                    match request.TargetCase with
                    | RenameRequest.TargetOneofCase.HeadId ->
                        let headId = HeadId(request.HeadId)
                        let headName = HeadName(request.Name)
                        foldersService.Rename(headId, headName)
                        |> Async.BindResult(fun _ ->
                            foldersService.RenameLink(parentId, headId, headName)
                        )
                    | RenameRequest.TargetOneofCase.FolderId ->
                        let folderId = FolderId(request.FolderId)
                        let folderName = FolderName(request.Name)
                        foldersService.Rename(folderId, folderName)
                        |> Async.BindResult(fun _ ->
                            foldersService.RenameLink(parentId, folderId, folderName)
                        )
                    | _ -> async.Return(Ok())
                    
                match result with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot rename")
                    let error = RenameReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- RenameReply.Types.Error.Types.Status.Unknown
                    let reply = RenameReply()
                    reply.Error <- error
                    return reply
                | Ok(model) ->
                    return RenameReply()
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                let error = RenameReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- RenameReply.Types.Error.Types.Status.NoAccess
                let reply = RenameReply()
                reply.Error <- error
                return reply
        }
        |> Async.StartAsTask
