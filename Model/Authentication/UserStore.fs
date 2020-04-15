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
open Utils.ResultHelper

type UserStore(context: IUserContext,
               userGroupsContext: IContext<UserGroups>,
               logger: ILogger<UserStore>) =

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
                let! result = context.Remove(entity)
                let! resultUserGroups = context.Remove(UserGroups.CreateDocumentKey(entity.Id))
                match (result, resultUserGroups) with
                | (Ok(u), Ok(ug)) ->
                    logger.LogInformation(sprintf "User %s successefuly deleted" user.Name)
                    return IdentityResult.Success
                | errors ->
                    let ex = ErrorOf2 errors
                    logger.LogError(ex, sprintf "User %s not deleted" user.Name)
                    return ex.ToIdentityResult()
            }

        member this.Dispose(): unit = 
            ()

        member this.FindByIdAsync(userId, cancellationToken) = 
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                let docKey = User.CreateDocumentKey(userId)
                let! result = context.Get(docKey)
                match result with
                | Ok(user) ->
                    logger.LogInformation(sprintf "User %s successfuly found by id" userId)
                    return user.ToModel()
                | Error(ex) ->
                    logger.LogError(ex, sprintf "User %s not found by id" userId)
                    return null
            }

        member this.FindByNameAsync(normalizedUserName, cancellationToken) = 
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                let! result = context.GetByName(normalizedUserName)
                match result with
                | Ok(user) ->
                    logger.LogInformation(sprintf "User %s successfuly found by normalized name" normalizedUserName)
                    return user.ToModel()
                | Error(ex) ->
                    logger.LogError(ex, sprintf "User %s not found by normalized name" normalizedUserName)
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
                let! result = context.Update(entity, fun _ -> entity)
                match result with
                | Ok(ok) ->
                    return IdentityResult.Success
                | Error(ex) ->
                    logger.LogError(ex, sprintf "User %s not updated" user.Name)
                    return ex.ToIdentityResult()
            }

        member this.CreateAsync(user, cancellationToken) =
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                let entity = user.ToEntity()
                let! result = context.Insert(entity, entity)
                let userGroups =
                    {
                        UserGroups.UserId = entity.Id
                        Groups = []
                    }
                let! userGroupsResult = userGroupsContext.Insert(userGroups, userGroups)

                match (result, userGroupsResult) with
                | (Ok(u), Ok(ug)) ->
                    logger.LogInformation(sprintf "User %s successefuly added" user.Name)
                    return IdentityResult.Success
                | errors ->
                    let ex = ErrorOf2 errors
                    logger.LogError(ex, sprintf "User %s not added" user.Name)
                    return ex.ToIdentityResult()
            }