namespace Services.Permissions

open System
open Models.Permissions
open Models.Identificators

type CheckPermissionsFail =
    | Error of Exception
    | Unauthorized of unit

type IPermissionsService =
    abstract member CheckPermissions : PermissionsModel * UserId -> Async<Result<unit, CheckPermissionsFail>>
    abstract member CheckPermissions : FolderId * UserId -> Async<Result<unit, CheckPermissionsFail>>
    abstract member CheckPermissions : HeadId * UserId -> Async<Result<unit, CheckPermissionsFail>>
    abstract member CheckPermissions : CommitId * UserId -> Async<Result<unit, CheckPermissionsFail>>
 