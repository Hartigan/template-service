namespace WebApi

open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Authorization
open Services.Permissions
open DatabaseTypes.Identificators
open System.Security.Claims
open System
open Microsoft.Extensions.Logging
open System.Text.Json.Serialization
open Services.Admin

type UpdateRolesRequest = {
    [<JsonPropertyName("user_id")>]
    UserId : UserId
    [<JsonPropertyName("roles")>]
    Roles : List<string>
}

[<Authorize(Roles = "superadmin")>]
[<Route("admin")>]
type AdminController(adminService: IAdminService,
                     logger: ILogger<AdminController>) =
    inherit ControllerBase()

    [<HttpGet>]
    [<Route("get")>]
    member this.GetAllUsers() =
        async {
            match! adminService.GetUsers() with
            | Error(ex) -> 
                logger.LogError(ex, "Cannot get users")
                return (BadRequestResult() :> IActionResult)
            | Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("update")>]
    member this.UpdateUserRoles([<FromBody>] req: UpdateRolesRequest) =
        async {
            match! adminService.UpdateRoles(req.UserId, req.Roles) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot update roles")
                return (BadRequestResult() :> IActionResult)
            | Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask
