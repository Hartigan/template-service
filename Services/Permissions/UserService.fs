namespace Services.Permissions

open Models.Permissions
open Models.Identificators
open Services.Permissions
open Contexts
open DatabaseTypes
open System

type UserService(userContext: IUserContext) =
    interface IUserService with
        member this.SearchByContains(pattern) =
            async {
                match! userContext.SearchByContainsInName(pattern) with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) ->
                        return Result.Error(GetUserFail.Error(error))
                | Ok(users) ->
                    return
                        users
                        |> Seq.map(fun user ->
                            match UserModel.Create(user) with
                            | Result.Error() ->
                                Result.Error(GetUserFail.Error(InvalidOperationException("Cannot create UserModel")))
                            | Ok(userModel) ->
                                Ok([ userModel ])
                        )
                        |> Seq.fold (fun x y ->
                                        match (x, y) with
                                        | (Ok(l), Ok(r)) -> Ok(l @ r)
                                        | (Result.Error(fail), _) -> Result.Error(fail)
                                        | (_, Result.Error(fail)) -> Result.Error(fail)) (Ok([]))
            }


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