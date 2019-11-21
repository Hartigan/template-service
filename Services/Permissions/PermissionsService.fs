namespace Services.Permissions

open DatabaseTypes
open Models.Permissions
open Models.Identificators
open Services.Permissions

type PermissionsService() =
    interface IPermissionsService with
        member this.CheckPermissions(permissions, userId) = permissions.OwnerId == userId
