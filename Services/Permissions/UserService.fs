namespace Services.Permissions

open Models.Permissions
open Models.Identificators
open Services.Permissions
open Contexts
open DatabaseTypes
open System
open Utils.ResultHelper

type UserService(userContext: IUserContext) =
    interface IUserService with
        member this.SearchByContains(pattern) =
            userContext.SearchByContainsInName(pattern)
            |> Async.TryMapResult(fun users ->
                users
                |> Seq.map UserModel.Create
                |> ResultOfSeq
            )

        member this.Get(id: UserId) =
            userContext.Get(User.CreateDocumentKey(id.Value))
            |> Async.TryMapResult UserModel.Create