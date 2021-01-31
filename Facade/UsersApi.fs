namespace Facade

open Microsoft.AspNetCore.Authorization
open GrpcUsers
open Microsoft.Extensions.Logging
open DatabaseTypes.Identificators
open Services.Permissions
open Grpc.Core
open System.Security.Claims
open Domain
open Utils.ResultHelper
open FSharp.Control
open System

[<Authorize>]
type UsersApi(userService: IUserService,
              logger: ILogger<UsersApi>) =
    inherit GrpcUsers.UsersService.UsersServiceBase()

    member private this.GetUserId(context: ServerCallContext) = UserId(context.GetHttpContext().User.FindFirst(ClaimTypes.NameIdentifier).Value)

    override this.Init(request, context) =
        async {
            let userId = this.GetUserId(context)
            match! userService.Init(userId) with
            | Error(ex) -> 
                logger.LogError(ex, "Cannot get user")
                let error = InitReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- InitReply.Types.Error.Types.Status.Unknown
                let reply = InitReply()
                reply.Error <- error
                return reply
            | Ok(model) ->
                return InitReply()
        }
        |> Async.StartAsTask

    override this.GetUser(request, context) =
        async {
            let userId = UserId(request.UserId)
            match! userService.Get(userId) with
            | Error(ex) -> 
                logger.LogError(ex, "Cannot get user")
                let error = GetUserReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- GetUserReply.Types.Error.Types.Status.Unknown
                let reply = GetUserReply()
                reply.Error <- error
                return reply
            | Ok(model) ->
                let reply = GetUserReply()
                reply.User <- Converter.Convert(model)
                return reply
        }
        |> Async.StartAsTask

    override this.Search(request, context) =
        async {
            let pattern =
                match request.Pattern with
                | null -> None
                | p -> Some(p)

            match! userService.Search(pattern, request.Offset, request.Limit) with
            | Error(ex) ->
                logger.LogError(ex, "Search failed")
                let error = SearchReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- SearchReply.Types.Error.Types.Status.Unknown
                let reply = SearchReply()
                reply.Error <- error
                return reply
            | Ok(model) ->
                let list = SearchReply.Types.UserList()
                Converter.Convert(model, list.Users, Converter.Convert)
                let reply = SearchReply()
                reply.Users <- list
                return reply
        }
        |> Async.StartAsTask
