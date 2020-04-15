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
            async {
                match! userContext.SearchByContainsInName(pattern) with
                | Error(ex) -> return Error(ex)
                | Ok(users) ->
                    return
                        users
                        |> Seq.map UserModel.Create
                        |> ResultOfSeq
            }


        member this.Get(id: UserId) =
            async {
                match! userContext.Get(User.CreateDocumentKey(id.Value)) with
                | Error(ex) -> return Error(ex)
                | Ok(entity) -> return UserModel.Create(entity)
            }