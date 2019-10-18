namespace Models.Authentication

open Models.Authentication.Converters
open Microsoft.AspNetCore.Identity
open Microsoft.Extensions.Logging
open System.Threading.Tasks
open Utils.TaskHelper
open Contexts
open Contexts.Results
open Domain
open System


type UserStore(context: UserContext, logger: ILogger<UserStore>) =

    interface IUserStore<UserIdentity> with
        member this.DeleteAsync(user, cancellationToken) = 
            taskC cancellationToken {
                if not cancellationToken.IsCancellationRequested then
                    let entity = user.ToEntity()
                    let! result = (context :> IContext<User>).Remove(entity)
                    match result with
                    | Result.Ok(ok) ->
                        logger.LogInformation(sprintf "User %s successefuly deleted" user.Name)
                        return IdentityResult.Success
                    | Result.Error(error) ->
                        match error with
                        | RemoveFail.Error(ex) ->
                            logger.LogError(ex, sprintf "User %s not deleted" user.Name)
                            let identityError = IdentityError()
                            identityError.Code <- ex.HResult.ToString()
                            identityError.Description <- ex.Message
                            return IdentityResult.Failed(identityError)
                else
                    logger.LogInformation(sprintf "User %s not deleted because operation canceled" user.Name)
                    let ex = OperationCanceledException(cancellationToken)
                    let identityError = IdentityError()
                    identityError.Code <- ex.HResult.ToString()
                    identityError.Description <- ex.Message
                    return IdentityResult.Failed(identityError)
            }

        member this.Dispose(): unit = 
            ()

        member this.FindByIdAsync(userId, cancellationToken) = 
            taskC cancellationToken {
                let entity = User()
                entity.Id <- userId
                let! result = (context :> IContext<User>).Get(entity)
                match result with
                | Result.Ok(user) ->
                    logger.LogInformation(sprintf "User %s successfuly found by id" userId)
                    return user.ToModel()
                | Result.Error(fail) ->
                    match fail with
                    | GetFail.Error(ex) ->
                        logger.LogError(sprintf "User %s not found by id" userId, ex)
                        let userIdentity = UserIdentity()
                        userIdentity.Id <- Guid.Empty
                        return userIdentity;
            }

        member this.FindByNameAsync(normalizedUserName, cancellationToken) = 
            taskC cancellationToken {
                let entity = User()
                entity.Id <- userId
                let! result = context.GetByName(normalizedUserName)
                match result with
                | Result.Ok(user) ->
                    logger.LogInformation(sprintf "User %s successfuly found by normalized name" normalizedUserName)
                    return user.ToModel()
                | Result.Error(fail) ->
                    match fail with
                    | GetFail.Error(ex) ->
                        logger.LogError(sprintf "User %s not found by normalized name" normalizedUserName, ex)
                        let userIdentity = UserIdentity()
                        userIdentity.Id <- Guid.Empty
                        return userIdentity;
            }

        member this.GetNormalizedUserNameAsync(user, cancellationToken) = 
            taskC cancellationToken {
                return user.NormalizedName
            }

        member this.GetUserIdAsync(user, cancellationToken) = 
            taskC cancellationToken {
                return user.Id.ToString()
            }

        member this.GetUserNameAsync(user, cancellationToken) = 
            taskC cancellationToken {
                return user.Name
            }

        member this.SetNormalizedUserNameAsync(user, normalizedName, cancellationToken) = 
            taskUC cancellationToken {
                user.NormalizedName <- normalizedName
                return user
            }

        member this.SetUserNameAsync(user, userName, cancellationToken) = 
            taskUC cancellationToken {
                user.Name <- userName
                return user
            }

        member this.UpdateAsync(user, cancellationToken) = 
            taskC cancellationToken {
                if not cancellationToken.IsCancellationRequested then
                    let entity = user.ToEntity()
                    let! result = (context :> IContext<User>).Update(entity, fun _ -> entity)
                    match result with
                    | Result.Ok(ok) ->
                        return IdentityResult.Success
                    | Result.Error(fail) ->
                        match fail with
                            | UpdateFail.Error(ex) ->
                                logger.LogError(sprintf "User %s not updated" user.Name, ex)
                                let identityError = IdentityError()
                                identityError.Code <- ex.HResult.ToString()
                                identityError.Description <- ex.Message
                                return IdentityResult.Failed(identityError)
                else
                    logger.LogError(sprintf "User %s not updated because operation canceled" user.Name)
                    let ex = OperationCanceledException(cancellationToken)
                    let identityError = IdentityError()
                    identityError.Code <- ex.HResult.ToString()
                    identityError.Description <- ex.Message
                    return IdentityResult.Failed(identityError)
            }

        member this.CreateAsync(user, cancellationToken) =
            taskC cancellationToken {
                if not cancellationToken.IsCancellationRequested then
                    let entity = user.ToEntity()
                    let! result = (context :> IContext<User>).Insert(entity, entity)
                    match result with
                    | Result.Ok(ok) ->
                        logger.LogInformation(sprintf "User %s successfuly added" user.Name)
                        return IdentityResult.Success
                    | Result.Error(error) ->
                        match error with
                        | InsertFail.Error(ex) ->
                            logger.LogError(ex, sprintf "User %s not added" user.Name)
                            let identityError = IdentityError()
                            identityError.Code <- ex.HResult.ToString()
                            identityError.Description <- ex.Message
                            return IdentityResult.Failed(identityError)
                else
                    logger.LogError(sprintf "User %s not added because operation canceled" user.Name)
                    let ex = OperationCanceledException(cancellationToken)
                    let identityError = IdentityError()
                    identityError.Code <- ex.HResult.ToString()
                    identityError.Description <- ex.Message
                    return IdentityResult.Failed(identityError)
            }