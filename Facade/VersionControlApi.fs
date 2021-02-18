namespace Facade

open Microsoft.AspNetCore.Authorization
open GrpcVersion
open Microsoft.Extensions.Logging
open DatabaseTypes.Identificators
open Services.VersionControl
open Services.Permissions
open Models.Permissions
open Grpc.Core
open System.Security.Claims
open Domain
open Utils.ResultHelper
open FSharp.Control
open System

[<Authorize(Roles="admin")>]
type VersionControlApi(permissionsService: IPermissionsService,
                       versionControlService: IVersionControlService,
                       logger: ILogger<VersionControlApi>) =
    inherit GrpcVersion.VersionService.VersionServiceBase()

    member private this.GetUserId(context: ServerCallContext) = UserId(context.GetHttpContext().User.FindFirst(ClaimTypes.NameIdentifier).Value)

    override this.GetHeads(request, context) =
        async {
            let userId = this.GetUserId(context)
            let reply = GetHeadsReply()

            let! entries =
                request.HeadIds
                |> AsyncSeq.ofSeq
                |> AsyncSeq.mapAsyncParallel(fun id ->
                    async {
                        let entry = GetHeadsReply.Types.Entry()
                        entry.HeadId <- id
                        let headId = HeadId(id)
                        match! permissionsService.CheckPermissions(ProtectedId.Head(headId), userId, AccessModel.CanRead) with
                        | Ok() ->
                            match! versionControlService.Get(headId) with
                            | Error(ex) ->
                                logger.LogError(ex, "Cannot get head")
                                entry.Status <- GetHeadsReply.Types.Status.Unknown
                                return entry
                            | Ok(model) ->
                                entry.Head <- Converter.Convert(model)
                                entry.Status <- GetHeadsReply.Types.Status.Ok
                                return entry
                        | Error(ex) ->
                            logger.LogError(ex, "Access denied")
                            entry.Status <- GetHeadsReply.Types.Status.NoAccess
                            return entry
                    }
                )
                |> AsyncSeq.toArrayAsync

            reply.Entries.AddRange(entries)
            return reply
        }
        |> Async.StartAsTask

    override this.GetCommit(request, context) =
        async {
            let userId = this.GetUserId(context)
            let commitId = CommitId(request.CommitId)

            match! versionControlService.Get(commitId) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get commit")
                let error = GetCommitReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- GetCommitReply.Types.Error.Types.Status.Unknown
                let reply = GetCommitReply()
                reply.Error <- error
                return reply
            | Ok(commit) ->
                match! permissionsService.CheckPermissions(ProtectedId.Head(commit.HeadId), userId, AccessModel.CanRead) with
                | Ok() ->
                    let reply = GetCommitReply()
                    reply.Commit <- Converter.Convert(commit)
                    return reply
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    let error = GetCommitReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- GetCommitReply.Types.Error.Types.Status.NoAccess
                    let reply = GetCommitReply()
                    reply.Error <- error
                    return reply
        }
        |> Async.StartAsTask

    override this.UpdateTags(request, context) =
        async {
            let userId = this.GetUserId(context)
            let headId = HeadId(request.HeadId)
            match! permissionsService.CheckPermissions(ProtectedId.Head(headId), userId, AccessModel.CanWrite) with
            | Ok() ->
                match! versionControlService.Update(headId, request.Tags |> Seq.map Models.Heads.TagModel |> List.ofSeq) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot update tags")
                    let error = UpdateTagsReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- UpdateTagsReply.Types.Error.Types.Status.Unknown
                    let reply = UpdateTagsReply()
                    reply.Error <- error
                    return reply
                | Ok(model) ->
                    return UpdateTagsReply()
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                let error = UpdateTagsReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- UpdateTagsReply.Types.Error.Types.Status.NoAccess
                let reply = UpdateTagsReply()
                reply.Error <- error
                return reply
        }
        |> Async.StartAsTask

    override this.Search(request, context) =
        async {
            let pattern =
                match request.Pattern with
                | null -> None
                | p -> Some(p)
            let ownerId =
                match request.OwnerId with
                | null -> None
                | id -> Some(UserId(id))
            let tags =
                request.Tags
                |> Seq.map Models.Heads.TagModel
                |> List.ofSeq

            let userId = this.GetUserId(context)
            match! versionControlService.Search(userId, pattern, ownerId, tags, request.Offset, request.Limit) with
            | Error(ex) ->
                logger.LogError(ex, "Search of heads failed")
                let error = SearchReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- SearchReply.Types.Error.Types.Status.Unknown
                let reply = SearchReply()
                reply.Error <- error
                return reply
            | Ok(model) ->
                let list = SearchReply.Types.HeadList()
                Converter.Convert(model, list.Heads, Converter.Convert)
                let reply = SearchReply()
                reply.Heads <- list
                return reply
        }
        |> Async.StartAsTask

