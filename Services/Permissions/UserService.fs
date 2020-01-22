namespace Services.Permissions

open Models.Permissions
open Models.Identificators
open Services.Permissions
open Contexts
open DatabaseTypes
open System

type UserService(userContext: UserContext) =
    let userContext = (userContext :> IContext<User>)

    interface IUserService with

        member this.Get(id: UserId) =
            async {
                match! userContext.Get(User.CreateDocumentKey(id.Value)) with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) ->
                        return Result.Error(GetUserFail.Error(error))
                | Ok(entity) ->
                    match UserModel.Create(entity) with
                    | Ok(model) ->
                        return Ok(model)
                    | Result.Error() ->
                        return Result.Error(GetUserFail.Error(InvalidOperationException("Cannot create UserModel")))
            }