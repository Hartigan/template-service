namespace Services.Permissions

open System
open Models.Identificators
open Models.Permissions

type GetUserFail =
    | Error of Exception

type IUserService =
    abstract member Get : UserId -> Async<Result<UserModel, GetUserFail>>
    abstract member SearchByContains : string -> Async<Result<List<UserModel>, GetUserFail>>