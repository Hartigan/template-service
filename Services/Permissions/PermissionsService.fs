namespace Services.Permissions

open Models.Permissions
open Models.Identificators
open Services.Permissions
open Services.Folders
open Services.VersionControl

type PermissionsService(foldersService: IFoldersService, versionControlService: IVersionControlService) =
    interface IPermissionsService with
        member this.CheckPermissions(folderId, userId) =
            async {
                match! foldersService.Get(folderId) with
                | Result.Error(fail) ->
                    match fail with
                    | Services.Folders.GetFail.Error(error) -> return Result.Error(CheckPermissionsFail.Error(error))
                | Result.Ok(folder) -> return! (this :> IPermissionsService).CheckPermissions(folder.Permissions, userId)
            }

        member this.CheckPermissions(headId: HeadId, userId: UserId) =
            async {
                match! versionControlService.Get(headId) with
                | Result.Error(fail) ->
                    match fail with
                    | Services.VersionControl.GetFail.Error(error) -> return Result.Error(CheckPermissionsFail.Error(error))
                | Result.Ok(head) -> return! (this :> IPermissionsService).CheckPermissions(head.Permissions, userId)
            }

        member this.CheckPermissions(commitId: CommitId, userId: UserId) =
            async {
                match! versionControlService.Get(commitId) with
                | Result.Error(fail) ->
                    match fail with
                    | Services.VersionControl.GetFail.Error(error) -> return Result.Error(CheckPermissionsFail.Error(error))
                | Result.Ok(commit) -> 
                    match! versionControlService.Get(commit.HeadId) with
                    | Result.Error(fail) ->
                        match fail with
                        | Services.VersionControl.GetFail.Error(error) -> return Result.Error(CheckPermissionsFail.Error(error))
                    | Result.Ok(head) -> return! (this :> IPermissionsService).CheckPermissions(head.Permissions, userId)
            }

        member this.CheckPermissions(permissions: PermissionsModel, userId: UserId): Async<Result<unit, CheckPermissionsFail>> = 
            async {
                if permissions.OwnerId = userId then
                    return Result.Ok()
                else
                    return Result.Error(CheckPermissionsFail.Unauthorized())
            }
            