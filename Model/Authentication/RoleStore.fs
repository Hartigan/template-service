namespace Models.Authentication

open Models.Authentication.Converters
open Models.Authentication.ExceptionExtensions
open Microsoft.AspNetCore.Identity
open Microsoft.Extensions.Logging
open System.Threading.Tasks
open Utils.TaskHelper
open Contexts
open Contexts.Results
open Domain
open System


type RoleStore(context: UserRoleContext, logger: ILogger<RoleStore>) =

    interface IRoleStore<RoleIdentity> with
        member this.CreateAsync(role, cancellationToken) =
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                let entity = role.ToEntity()
                let! result = (context :> IContext<UserRole>).Insert(entity, entity)
                match result with
                | Result.Ok(ok) ->
                    logger.LogInformation(sprintf "Role %s successfuly added" role.Name)
                    return IdentityResult.Success
                | Result.Error(error) ->
                    match error with
                    | InsertFail.Error(ex) ->
                        logger.LogError(ex, sprintf "Role %s not added" role.Name)
                        return ex.ToIdentityResult()
            }

        member this.DeleteAsync(role, cancellationToken) =
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                let entity = role.ToEntity()
                let! result = (context :> IContext<UserRole>).Remove(entity)
                match result with
                | Result.Ok(ok) ->
                    logger.LogInformation(sprintf "Role %s successfuly deleted" role.Name)
                    return IdentityResult.Success
                | Result.Error(error) ->
                    match error with
                    | RemoveFail.Error(ex) ->
                        logger.LogError(ex, sprintf "Role %s not deleted" role.Name)
                        return ex.ToIdentityResult()
            }

        member this.Dispose(): unit = 
            ()

        member this.FindByIdAsync(roleId, cancellationToken) =
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                let entity = UserRole()
                entity.Id <- roleId
                let! result = (context :> IContext<UserRole>).Get(entity)
                match result with
                | Result.Ok(role) ->
                    logger.LogInformation(sprintf "Role %s successfuly found by id" roleId)
                    return role.ToModel()
                | Result.Error(error) ->
                    match error with
                    | GetFail.Error(ex) ->
                        logger.LogError(sprintf "Role %s not found by id" roleId, ex)
                        let roleIdentity = RoleIdentity()
                        roleIdentity.Id <- Guid.Empty
                        return roleIdentity;
            }

        member this.FindByNameAsync(normalizedRoleName, cancellationToken) =
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                let! result = context.GetByName(normalizedRoleName)
                match result with
                | Result.Ok(role) ->
                    logger.LogInformation(sprintf "Role %s successfuly found by name" normalizedRoleName)
                    return role.ToModel()
                | Result.Error(error) ->
                    match error with
                    | GetFail.Error(ex) ->
                        logger.LogError(sprintf "Role %s not found by name" normalizedRoleName, ex)
                        let roleIdentity = RoleIdentity()
                        roleIdentity.Id <- Guid.Empty
                        return roleIdentity;
            }

        member this.GetNormalizedRoleNameAsync(role, cancellationToken) =
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                return role.Name
            }

        member this.GetRoleIdAsync(role, cancellationToken) =
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                return role.Id.ToString()
            }

        member this.GetRoleNameAsync(role, cancellationToken) =
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                return role.Name
            }

        member this.SetNormalizedRoleNameAsync(role, normalizedName, cancellationToken) =
            taskUC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                role.Name <- normalizedName
            }

        member this.SetRoleNameAsync(role, roleName, cancellationToken) =
            taskUC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                role.Name <- roleName
            }

        member this.UpdateAsync(role, cancellationToken) =
            taskC cancellationToken {
                cancellationToken.ThrowIfCancellationRequested()
                let entity = role.ToEntity()
                let! result = (context :> IContext<UserRole>).Update(entity, fun _ -> entity)
                match result with
                | Result.Ok(ok) ->
                    return IdentityResult.Success
                | Result.Error(fail) ->
                    match fail with
                        | UpdateFail.Error(ex) ->
                            logger.LogError(sprintf "Role %s not updated" role.Name, ex)
                            return ex.ToIdentityResult()
            }
