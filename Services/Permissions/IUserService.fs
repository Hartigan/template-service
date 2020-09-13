namespace Services.Permissions

open System
open DatabaseTypes.Identificators
open Models.Permissions


type IUserService =
    abstract member Get : UserId -> Async<Result<UserModel, Exception>>
    abstract member Search : string option * offset:UInt32 * limit:UInt32 -> Async<Result<List<UserModel>, Exception>>
    abstract member Init : UserId -> Async<Result<unit, Exception>>