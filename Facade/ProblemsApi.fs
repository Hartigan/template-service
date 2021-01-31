namespace Facade

open Microsoft.AspNetCore.Authorization
open GrpcProblems
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
type ProblemsApi(foldersService: IFoldersService,
                 permissionsService: IPermissionsService,
                 versionControlService: IVersionControlService,
                 problemsService: IProblemsService,
                 generatorService: IGeneratorService,
                 logger: ILogger<ProblemsApi>) =
    inherit GrpcProblems.ProblemsService.ProblemsServiceBase()

    member private this.GetUserId(context: ServerCallContext) = UserId(context.GetHttpContext().User.FindFirst(ClaimTypes.NameIdentifier).Value)

    override this.GetProblem(request, context) =
        async {
            let userId = this.GetUserId(context)
            let commitId = CommitId(request.CommitId)

            match! versionControlService.Get(commitId) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get commit for problem")
                let error = GetProblemReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- GetProblemReply.Types.Error.Types.Status.NoCommit
                let reply = GetProblemReply()
                reply.Error <- error
                return reply
            | Ok(commit) ->
                match! permissionsService.CheckPermissions(ProtectedId.Head(commit.HeadId), userId, AccessModel.CanRead) with
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    let error = GetProblemReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- GetProblemReply.Types.Error.Types.Status.NoAccess
                    let reply = GetProblemReply()
                    reply.Error <- error
                    return reply
                | Ok() ->
                    match commit.Target.ConcreteId with
                    | Problem(problemId) ->
                        match! problemsService.Get(problemId) with
                        | Ok(model) ->
                            let reply = GetProblemReply()
                            reply.Problem <- Converter.Convert(model)
                            return reply
                        | Error(ex) -> 
                            logger.LogError(ex, "Cannot get problem")
                            let error = GetProblemReply.Types.Error()
                            error.Description <- ex.Message
                            error.Status <- GetProblemReply.Types.Error.Types.Status.Unknown
                            let reply = GetProblemReply()
                            reply.Error <- error
                            return reply
                    | _ ->
                        let ex = ArgumentException("Wrong type of commit")
                        logger.LogError("Invalid type")
                        let error = GetProblemReply.Types.Error()
                        error.Description <- ex.Message
                        error.Status <- GetProblemReply.Types.Error.Types.Status.InvalidType
                        let reply = GetProblemReply()
                        reply.Error <- error
                        return reply
        }
        |> Async.StartAsTask

    override this.TestProblem(request, context) =
        async {
            let userId = this.GetUserId(context)
            let commitId = CommitId(request.CommitId)
            let problemSeed = Models.Problems.ProblemSeed(request.Seed)

            match! versionControlService.Get(commitId) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get commit for problem")
                let error = TestProblemReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- TestProblemReply.Types.Error.Types.Status.NoCommit
                let reply = TestProblemReply()
                reply.Error <- error
                return reply
            | Ok(commit) ->
                match! permissionsService.CheckPermissions(ProtectedId.Head(commit.HeadId), userId, AccessModel.CanRead) with
                | Ok() ->
                    match commit.Target.ConcreteId with
                    | Problem(problemId) ->
                        match! generatorService.TestGenerate(problemId, problemSeed) with
                        | Ok(model) ->
                            let reply = TestProblemReply()
                            reply.Problem <- Converter.Convert(model)
                            return reply
                        | Error(ex) -> 
                            logger.LogError(ex, "Cannot generate problem")
                            let error = TestProblemReply.Types.Error()
                            error.Description <- ex.Message
                            error.Status <- TestProblemReply.Types.Error.Types.Status.Unknown
                            let reply = TestProblemReply()
                            reply.Error <- error
                            return reply
                    | _ ->
                        let ex = ArgumentException("Invalid type of commit")
                        logger.LogError(ex, "Invalid type")
                        let error = TestProblemReply.Types.Error()
                        error.Description <- ex.Message
                        error.Status <- TestProblemReply.Types.Error.Types.Status.InvalidType
                        let reply = TestProblemReply()
                        reply.Error <- error
                        return reply
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    let error = TestProblemReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- TestProblemReply.Types.Error.Types.Status.NoAccess
                    let reply = TestProblemReply()
                    reply.Error <- error
                    return reply
        }
        |> Async.StartAsTask

    override this.Validate(request, context) =
        async {
            let userId = this.GetUserId(context)
            let commitId = CommitId(request.CommitId)
            let actualAnswer = Models.Problems.ProblemAnswer(request.ActualAnswer)
            let expectedAnswer = Models.Problems.ProblemAnswer(request.ExpectedAnswer)

            match! versionControlService.Get(commitId) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get commit for problem")
                let error = ValidateReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- ValidateReply.Types.Error.Types.Status.NoCommit
                let reply = ValidateReply()
                reply.Error <- error
                return reply
            | Ok(commit) ->
                match! permissionsService.CheckPermissions(ProtectedId.Head(commit.HeadId), userId, AccessModel.CanRead) with
                | Ok() ->
                    match commit.Target.ConcreteId with
                    | Problem(problemId) ->
                        match! generatorService.TestValidate(problemId, expectedAnswer, actualAnswer) with
                        | Ok(model) ->
                            let reply = ValidateReply()
                            reply.IsCorrect <- model
                            return reply
                        | Error(ex) ->
                            logger.LogError(ex, "Cannot generate problem")
                            let error = ValidateReply.Types.Error()
                            error.Description <- ex.Message
                            error.Status <- ValidateReply.Types.Error.Types.Status.Unknown
                            let reply = ValidateReply()
                            reply.Error <- error
                            return reply
                    | _ ->
                        let ex = ArgumentException("Invalid type of commit")
                        logger.LogError("Invalid type")
                        let error = ValidateReply.Types.Error()
                        error.Description <- ex.Message
                        error.Status <- ValidateReply.Types.Error.Types.Status.InvalidType
                        let reply = ValidateReply()
                        reply.Error <- error
                        return reply
                | Error(ex) ->
                    logger.LogError(ex, "Access denied")
                    let error = ValidateReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- ValidateReply.Types.Error.Types.Status.NoAccess
                    let reply = ValidateReply()
                    reply.Error <- error
                    return reply
        }
        |> Async.StartAsTask

    override this.CreateProblem(request, context) =
        async {
            let userId = this.GetUserId(context)
            let name = HeadName(request.Name)
            let folderId = FolderId(request.FolderId)

            match BackConverter.Convert(request.Problem) with
            | None ->
                let ex = ArgumentException("Invalid Problem")
                logger.LogError(ex, "Invalid Problem data")
                let error = CreateProblemReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- CreateProblemReply.Types.Error.Types.Status.InvalidInput
                let reply = CreateProblemReply()
                reply.Error <- error
                return reply
            | Some(problem) ->
                match! permissionsService.CheckPermissions(ProtectedId.Folder(folderId), userId, AccessModel.CanWrite) with
                | Ok() ->
                    match! problemsService.Create(problem) with
                    | Error(ex) ->
                        logger.LogError(ex, "Cannot create problem") 
                        let error = CreateProblemReply.Types.Error()
                        error.Description <- ex.Message
                        error.Status <- CreateProblemReply.Types.Error.Types.Status.Unknown
                        let reply = CreateProblemReply()
                        reply.Error <- error
                        return reply
                    | Ok(problemId) ->
                        match! versionControlService.Create(name, ConcreteId.Problem(problemId), CommitDescription("Initial commit"), userId) with
                        | Error(ex) ->
                            logger.LogError(ex, "Cannot commit problem")
                            let error = CreateProblemReply.Types.Error()
                            error.Description <- ex.Message
                            error.Status <- CreateProblemReply.Types.Error.Types.Status.Unknown
                            let reply = CreateProblemReply()
                            reply.Error <- error
                            return reply
                        | Ok(headId) ->
                            match! foldersService.Add(headId, folderId) with
                            | Error(ex) ->
                                logger.LogError(ex, "Cannot create head for problem")
                                let error = CreateProblemReply.Types.Error()
                                error.Description <- ex.Message
                                error.Status <- CreateProblemReply.Types.Error.Types.Status.Unknown
                                let reply = CreateProblemReply()
                                reply.Error <- error
                                return reply
                            | Ok() ->
                                let reply = CreateProblemReply()
                                reply.HeadId <- headId.Value
                                return reply
                | Error(ex) ->
                    logger.LogError(ex, "Access denied") 
                    let error = CreateProblemReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- CreateProblemReply.Types.Error.Types.Status.NoAccess
                    let reply = CreateProblemReply()
                    reply.Error <- error
                    return reply
        }
        |> Async.StartAsTask

    override this.UpdateProblem(request, context) =
        async {
            let userId = this.GetUserId(context)
            let headId = HeadId(request.HeadId)
            let description = CommitDescription(request.Description)

            match BackConverter.Convert(request.Problem) with
            | None ->
                let ex = ArgumentException("Invalid Problem")
                logger.LogError(ex, "Invalid Problem data")
                let error = UpdateProblemReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- UpdateProblemReply.Types.Error.Types.Status.InvalidInput
                let reply = UpdateProblemReply()
                reply.Error <- error
                return reply
            | Some(problem) ->
                match! permissionsService.CheckPermissions(ProtectedId.Head(headId), userId, AccessModel.CanWrite) with
                | Ok() ->
                    match! problemsService.Create(problem) with
                    | Error(ex) ->
                        logger.LogError(ex, "Cannot update problem") 
                        let error = UpdateProblemReply.Types.Error()
                        error.Description <- ex.Message
                        error.Status <- UpdateProblemReply.Types.Error.Types.Status.Unknown
                        let reply = UpdateProblemReply()
                        reply.Error <- error
                        return reply
                    | Ok(problemId) ->
                        match! versionControlService.Create(ConcreteId.Problem(problemId), description, userId, headId) with
                        | Error(ex) ->
                            logger.LogError(ex, "Cannot commit changes of problem")
                            let error = UpdateProblemReply.Types.Error()
                            error.Description <- ex.Message
                            error.Status <- UpdateProblemReply.Types.Error.Types.Status.Unknown
                            let reply = UpdateProblemReply()
                            reply.Error <- error
                            return reply
                        | Ok(commitId) ->
                            let reply = UpdateProblemReply()
                            reply.CommitId <- commitId.Value
                            return reply
                | Error(ex) ->
                    logger.LogError(ex, "Access denied") 
                    let error = UpdateProblemReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- UpdateProblemReply.Types.Error.Types.Status.NoAccess
                    let reply = UpdateProblemReply()
                    reply.Error <- error
                    return reply
        }
        |> Async.StartAsTask

