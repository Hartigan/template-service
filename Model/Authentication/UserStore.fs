namespace Models.Authentication

open Models.Authentication.Converters
open Models.Authentication.ExceptionExtensions
open Microsoft.AspNetCore.Identity
open Microsoft.Extensions.Logging
open System.Threading.Tasks
open Utils.TaskHelper
open Contexts
open DatabaseTypes
open System


type UserStore(context: UserContext, logger: ILogger<UserStore>) =

    interface IUserPasswordStore<UserIdentity> with
        member this.GetPasswordHashAsync(user, cancellationToken) =
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                return user.PasswordHash
            }

        member this.HasPasswordAsync(user, cancellationToken) = 
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                return true
            }

        member this.SetPasswordHashAsync(user, passwordHash, cancellationToken) = 
            taskUC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                user.PasswordHash <- passwordHash
            }

        member this.DeleteAsync(user, cancellationToken) = 
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                let entity = user.ToEntity()
                let! result = (context :> IContext<User>).Remove(entity)
                match result with
                | Result.Ok(ok) ->
                    logger.LogInformation(sprintf "User %s successefuly deleted" user.Name)
                    return IdentityResult.Success
                | Result.Error(error) ->
                    match error with
                    | RemoveDocumentFail.Error(ex) ->
                        logger.LogError(ex, sprintf "User %s not deleted" user.Name)
                        return ex.ToIdentityResult()
            }

        member this.Dispose(): unit = 
            ()

        member this.FindByIdAsync(userId, cancellationToken) = 
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                let docKey = User.CreateDocumentKey(userId)
                let! result = (context :> IContext<User>).Get(docKey)
                match result with
                | Result.Ok(user) ->
                    logger.LogInformation(sprintf "User %s successfuly found by id" userId)
                    return user.ToModel()
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(ex) ->
                        logger.LogError(sprintf "User %s not found by id" userId, ex)
                        return null
            }

        member this.FindByNameAsync(normalizedUserName, cancellationToken) = 
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                let! result = context.GetByName(normalizedUserName)
                match result with
                | Result.Ok(user) ->
                    logger.LogInformation(sprintf "User %s successfuly found by normalized name" normalizedUserName)
                    return user.ToModel()
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(ex) ->
                        logger.LogError(sprintf "User %s not found by normalized name" normalizedUserName, ex)
                        return null
            }

        member this.GetNormalizedUserNameAsync(user, cancellationToken) = 
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                return user.NormalizedName
            }

        member this.GetUserIdAsync(user, cancellationToken) = 
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                return user.Id.ToString()
            }

        member this.GetUserNameAsync(user, cancellationToken) = 
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                return user.Name
            }

        member this.SetNormalizedUserNameAsync(user, normalizedName, cancellationToken) = 
            taskUC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                user.NormalizedName <- normalizedName
                return user
            }

        member this.SetUserNameAsync(user, userName, cancellationToken) = 
            taskUC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                user.Name <- userName
                return user
            }

        member this.UpdateAsync(user, cancellationToken) = 
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                let entity = user.ToEntity()
                let! result = (context :> IContext<User>).Update(entity, fun _ -> Result.Ok(entity))
                match result with
                | Result.Ok(ok) ->
                    return IdentityResult.Success
                | Result.Error(fail) ->
                    match fail with
                        | UpdateDocumentFail.Error(ex) ->
                            logger.LogError(sprintf "User %s not updated" user.Name, ex)
                            return ex.ToIdentityResult()
                        | UpdateDocumentFail.CustomFail(fail) ->
                            return UnknownFailResult()
            }

        member this.CreateAsync(user, cancellationToken) =
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                let entity = user.ToEntity()
                let! result = (context :> IContext<User>).Insert(entity, entity)
                match result with
                | Result.Ok(ok) ->
                    logger.LogInformation(sprintf "User %s successfuly added" user.Name)
                    return IdentityResult.Success
                | Result.Error(error) ->
                    match error with
                    | InsertDocumentFail.Error(ex) ->
                        logger.LogError(ex, sprintf "User %s not added" user.Name)
                        return ex.ToIdentityResult()
            }