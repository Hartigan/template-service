
namespace Services.Admin

open DatabaseTypes.Identificators
open DatabaseTypes
open System
open Contexts
open Utils.ResultHelper

type AdminService(userContext: IUserContext) =
    interface IAdminService with
        member this.UpdateRoles(userId, roles) = 
            userContext.Update(User.CreateDocumentKey(userId), fun user ->
                {
                    user with
                        Roles = roles
                }
            )

        member this.GetUsers() =
            userContext.GetAll()
            |> Async.MapResult(fun users ->
                users
                |> Seq.map(fun user ->
                    {
                        Id = user.Id
                        Username = user.Name
                        FirstName = user.FirstName
                        LastName = user.LastName
                        Email = user.Email
                        Roles = user.Roles
                    }
                )
                |> Seq.toList
            )