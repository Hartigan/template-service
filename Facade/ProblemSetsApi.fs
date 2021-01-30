namespace Facade

open Microsoft.AspNetCore.Authorization
open GrpcProblemSets
open Models.Permissions
open Services.Folders
open Services.Permissions
open Services.VersionControl
open Services.Problems
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
type ProblemSetsApi(foldersService: IFoldersService,
                    permissionsService: IPermissionsService,
                    versionControlService: IVersionControlService,
                    problemsService: IProblemsService,
                    logger: ILogger<ProblemSetsApi>) =
    inherit GrpcProblemSets.ProblemSetsService.ProblemSetsServiceBase()

    member private this.GetUserId(context: ServerCallContext) = UserId(context.GetHttpContext().User.FindFirst(ClaimTypes.NameIdentifier).Value)

    override this.GetProblemSet(request, context) =
        async {
            let userId = this.GetUserId(context)
            let commitId = CommitId(request.CommitId)

            match! versionControlService.Get(commitId) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get commit for problem set")
                let error = GetProblemSetReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- GetProblemSetReply.Types.Error.Types.Status.NoCommit
                let reply = GetProblemSetReply()
                reply.Error <- error
                return reply
            | Ok(commit) ->
                match! permissionsService.CheckPermissions(ProtectedId.Head(commit.HeadId), userId, AccessModel.CanRead) with
                | Ok() ->
                    match commit.Target.ConcreteId with
                    | ProblemSet(problemSetId) ->
                        match! problemsService.Get(problemSetId) with
                        | Ok(model) ->
                            let reply = GetProblemSetReply()
                            reply.ProblemSet <- Converter.Convert(model)
                            return reply
                        | Error(ex) ->
                            logger.LogError(ex, "Cannot get problem set")
                            let error = GetProblemSetReply.Types.Error()
                            error.Description <- ex.Message
                            error.Status <- GetProblemSetReply.Types.Error.Types.Status.Unknown
                            let reply = GetProblemSetReply()
                            reply.Error <- error
                            return reply
                    | _ ->
                        let ex = ArgumentException("Wrong type of commit")
                        logger.LogError("Invalid type")
                        let error = GetProblemSetReply.Types.Error()
                        error.Description <- ex.Message
                        error.Status <- GetProblemSetReply.Types.Error.Types.Status.InvalidType
                        let reply = GetProblemSetReply()
                        reply.Error <- error
                        return reply
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    let error = GetProblemSetReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- GetProblemSetReply.Types.Error.Types.Status.NoAccess
                    let reply = GetProblemSetReply()
                    reply.Error <- error
                    return reply
        }
        |> Async.StartAsTask

    override this.CreateProblemSet(request, context) =
        async {
            let folderId = FolderId(request.FolderId)
            let name = HeadName(request.Name)
            let userId = this.GetUserId(context)

            match BackConverter.Convert(request.ProblemSet) with
            | None ->
                let ex = ArgumentException("Invalid Problem Set")
                logger.LogError(ex, "Invalid Problem Set data")
                let error = CreateProblemSetReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- CreateProblemSetReply.Types.Error.Types.Status.InvalidInput
                let reply = CreateProblemSetReply()
                reply.Error <- error
                return reply
            | Some(problemSet) ->
                match! permissionsService.CheckPermissions(ProtectedId.Folder(folderId), userId, AccessModel.CanWrite) with
                | Ok() ->
                    match! problemsService.Create(problemSet) with
                    | Error(ex) ->
                        let error = CreateProblemSetReply.Types.Error()
                        error.Description <- ex.Message
                        error.Status <- CreateProblemSetReply.Types.Error.Types.Status.Unknown
                        let reply = CreateProblemSetReply()
                        reply.Error <- error
                        return reply
                    | Ok(problemSetId) ->
                        match! versionControlService.Create(name, ConcreteId.ProblemSet(problemSetId), CommitDescription("Initial commit"), userId) with
                        | Error(ex) ->
                            logger.LogError(ex, "Cannot commit problem set")
                            let error = CreateProblemSetReply.Types.Error()
                            error.Description <- ex.Message
                            error.Status <- CreateProblemSetReply.Types.Error.Types.Status.Unknown
                            let reply = CreateProblemSetReply()
                            reply.Error <- error
                            return reply
                        | Ok(headId) ->
                            match! foldersService.Add(headId, folderId) with
                            | Error(ex) ->
                                logger.LogError(ex, "Cannot add head for problem set")
                                let error = CreateProblemSetReply.Types.Error()
                                error.Description <- ex.Message
                                error.Status <- CreateProblemSetReply.Types.Error.Types.Status.Unknown
                                let reply = CreateProblemSetReply()
                                reply.Error <- error
                                return reply
                            | Ok() ->
                                let reply = CreateProblemSetReply()
                                reply.HeadId <- headId.Value
                                return reply
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    let error = CreateProblemSetReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- CreateProblemSetReply.Types.Error.Types.Status.NoAccess
                    let reply = CreateProblemSetReply()
                    reply.Error <- error
                    return reply
        }
        |> Async.StartAsTask

    override this.UpdateProblemSet(request, context) =
        async {
            let headId = HeadId(request.HeadId)
            let description = CommitDescription(request.Description)
            let userId = this.GetUserId(context)

            match BackConverter.Convert(request.ProblemSet) with
            | None ->
                let ex = ArgumentException("Invalid Problem Set")
                logger.LogError(ex, "Invalid Problem Set data")
                let error = UpdateProblemSetReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- UpdateProblemSetReply.Types.Error.Types.Status.InvalidInput
                let reply = UpdateProblemSetReply()
                reply.Error <- error
                return reply
            | Some(problemSet) ->
                match! permissionsService.CheckPermissions(ProtectedId.Head(headId), userId, AccessModel.CanWrite) with
                | Ok() ->
                    match! problemsService.Create(problemSet) with
                    | Error(ex) ->
                        let error = UpdateProblemSetReply.Types.Error()
                        error.Description <- ex.Message
                        error.Status <- UpdateProblemSetReply.Types.Error.Types.Status.Unknown
                        let reply = UpdateProblemSetReply()
                        reply.Error <- error
                        return reply
                    | Ok(problemSetId) ->
                        match! versionControlService.Create(ConcreteId.ProblemSet(problemSetId), description, userId, headId) with
                        | Error(ex) ->
                            logger.LogError(ex, "Cannot commit changes for problem set")
                            let error = UpdateProblemSetReply.Types.Error()
                            error.Description <- ex.Message
                            error.Status <- UpdateProblemSetReply.Types.Error.Types.Status.Unknown
                            let reply = UpdateProblemSetReply()
                            reply.Error <- error
                            return reply
                        | Ok(commitId) ->
                            let reply = UpdateProblemSetReply()
                            reply.CommitId <- commitId.Value
                            return reply
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    let error = UpdateProblemSetReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- UpdateProblemSetReply.Types.Error.Types.Status.NoAccess
                    let reply = UpdateProblemSetReply()
                    reply.Error <- error
                    return reply
        }
        |> Async.StartAsTask