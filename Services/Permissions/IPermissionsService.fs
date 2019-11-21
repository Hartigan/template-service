namespace Services.Permissions

open System
open Models.Permissions
open Models.Identificators

type IPermissionsService =
    abstract member CheckPermissions : PermissionsModel * UserId -> bool
 