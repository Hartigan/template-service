namespace Services.Permissions

open System
open Models.Permissions
open DatabaseTypes.Identificators
open Utils.Converters
open DatabaseTypes

type IPermissionsService =
    abstract member CheckPermissions : ProtectedId * UserId * AccessModel -> Async<Result<unit, Exception>>
    abstract member CheckPermissions : GroupId * UserId * AccessModel -> Async<Result<unit, Exception>>
    abstract member Create : UserId * GroupName * GroupDescription -> Async<Result<GroupId, Exception>>
    abstract member SearchByContains : string -> Async<Result<List<GroupModel>, Exception>>
    abstract member Get : UserId * AccessModel * ProtectedType -> Async<Result<List<ProtectedId>, Exception>>
    abstract member Get : UserId * AccessModel -> Async<Result<List<GroupModel>, Exception>>
    abstract member Get : GroupId -> Async<Result<GroupModel, Exception>>
    abstract member Get : ProtectedId -> Async<Result<PermissionsModel, Exception>>
    abstract member Update : GroupId * Option<GroupName> * Option<GroupDescription> -> Async<Result<unit, Exception>>
    abstract member Remove : GroupId * UserId -> Async<Result<unit, Exception>>
    abstract member Update : GroupId * UserId * AccessModel -> Async<Result<unit, Exception>>
    abstract member Add : GroupId * UserId -> Async<Result<unit, Exception>>
    abstract member Update : ProtectedId * UserId * AccessModel -> Async<Result<unit, Exception>>
    abstract member Update : ProtectedId * GroupId * AccessModel -> Async<Result<unit, Exception>>
    abstract member Share : ProtectedId * UserId -> Async<Result<unit, Exception>>
    abstract member Share : ProtectedId * GroupId -> Async<Result<unit, Exception>>
    abstract member Add : ProtectedId * UserId -> Async<Result<unit, Exception>>
    abstract member Add : ProtectedId * GroupId -> Async<Result<unit, Exception>>
    abstract member Remove : ProtectedId * UserId -> Async<Result<unit, Exception>>
    abstract member Remove : ProtectedId * GroupId -> Async<Result<unit, Exception>>
    abstract member UserItemsAppend : ProtectedId * UserId -> Async<Result<unit, Exception>>
    abstract member GetOwner : ProtectedId -> Async<Result<UserId, Exception>>