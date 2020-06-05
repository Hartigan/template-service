namespace Services.Permissions

open Models.Permissions
open DatabaseTypes.Identificators
open Services.Permissions
open Contexts
open DatabaseTypes
open System
open Utils.ResultHelper

type UserService(userContext: IUserContext) =
    interface IUserService with
        member this.Search(pattern, offset, limit) =
            userContext.Search(pattern, offset, limit)
            |> Async.TryMapResult(fun users ->
                users
                |> Seq.map UserModel.Create
                |> ResultOfSeq
            )

        member this.Get(id: UserId) =
            userContext.Get(User.CreateDocumentKey(id))
            |> Async.TryMapResult UserModel.Create