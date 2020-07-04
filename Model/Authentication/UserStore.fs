namespace Models.Authentication

open Models.Authentication.Converters
open Models.Authentication.ExceptionExtensions
open Microsoft.AspNetCore.Identity
open Microsoft.Extensions.Logging
open System.Threading.Tasks
open Utils.TaskHelper
open Contexts
open DatabaseTypes
open DatabaseTypes.Identificators
open System
open Utils.ResultHelper
open System.Threading
open System.Collections.Generic

type UserStore(context: IUserContext,
               userGroupsContext: IContext<UserGroups>,
               userItemsContext: IContext<UserItems>,
               trashContext: IContext<Trash>,
               logger: ILogger<UserStore>) =


    interface IUserStore<UserIdentity> with
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
                let docKey = User.CreateDocumentKey(UserId(userId))
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
                let entityResult = context.Insert(entity, entity)

                let userGroups =
                    {
                        UserGroups.UserId = entity.Id
                        Type = UserGroupsType.Instance
                        Allowed = []
                        Owned = []
                    }
                let userGroupsResult = userGroupsContext.Insert(userGroups, userGroups)

                let userItems =
                    {
                        UserItems.UserId = entity.Id
                        Type = UserItemsType.Instance
                        Allowed = {
                            Heads = []
                            Folders = []
                            Reports = []
                            Submissions = []
                        }
                        Owned = {
                            Heads = []
                            Folders = []
                            Reports = []
                            Submissions = []
                        }
                    }
                let userItemsResult = userItemsContext.Insert(userItems, userItems)

                let trash =
                    {
                        Trash.OwnerId = entity.Id
                        Heads = []
                        Folders = []
                        Type = TrashType.Instance
                    }

                let trashResult = trashContext.Insert(trash, trash)

                let! result =
                    seq {
                        entityResult
                        userGroupsResult
                        userItemsResult
                        trashResult
                    }
                    |> ResultOfAsyncSeq


                match result with
                | Ok(_) ->
                    logger.LogInformation(sprintf "User %s successefuly added" user.Name)
                    return IdentityResult.Success
                | Error(ex) ->
                    logger.LogError(ex, sprintf "User %s not added" user.Name)
                    return ex.ToIdentityResult()
            }

    interface IUserRoleStore<UserIdentity> with
        member this.AddToRoleAsync(user, roleName, cancellationToken) =
            taskUC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                user.Roles <- roleName :: user.Roles
            }

        member this.GetRolesAsync(user, cancellationToken) = 
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                return ResizeArray<string>(user.Roles) :> IList<string>
            }

        member this.GetUsersInRoleAsync(roleName, cancellationToken): Task<Collections.Generic.IList<UserIdentity>> = 
            failwith "Not Implemented"

        member this.IsInRoleAsync(user, roleName, cancellationToken): Task<bool> = 
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                return
                    user.Roles
                    |> Seq.exists(fun role -> role = roleName)
            }

        member this.RemoveFromRoleAsync(user, roleName, cancellationToken): Task = 
            taskUC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                user.Roles <-
                    user.Roles
                    |> Seq.filter(fun role -> role <> roleName)
                    |> List.ofSeq
            }


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

