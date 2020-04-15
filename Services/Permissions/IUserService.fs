namespace Services.Permissions

open System
open Models.Identificators
open Models.Permissions


type IUserService =
    abstract member Get : UserId -> Async<Result<UserModel, Exception>>
    abstract member SearchByContains : string -> Async<Result<List<UserModel>, Exception>>