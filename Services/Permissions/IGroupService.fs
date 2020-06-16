namespace Services.Permissions

open System
open Models.Permissions
open DatabaseTypes.Identificators

type IGroupService =
    abstract member Create : UserId * GroupName * GroupDescription -> Async<Result<GroupId, Exception>>
    abstract member Update : GroupId * Option<GroupName> * Option<GroupDescription> -> Async<Result<unit, Exception>>
    abstract member Remove : GroupId * UserId -> Async<Result<unit, Exception>>
    abstract member Update : GroupId * UserId * AccessModel -> Async<Result<unit, Exception>>
    abstract member Add : GroupId * UserId -> Async<Result<unit, Exception>>
    abstract member Get : GroupId -> Async<Result<GroupModel, Exception>>
    abstract member Search : string option * offset:UInt32 * limit:UInt32 -> Async<Result<List<GroupModel>, Exception>>
