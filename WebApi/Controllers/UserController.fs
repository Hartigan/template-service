namespace WebApi

open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Authorization
open Services.Permissions
open DatabaseTypes.Identificators
open System.Security.Claims
open System
open Microsoft.Extensions.Logging

[<Authorize>]
[<Route("user")>]
type UserController(userService: IUserService,
                    logger: ILogger<UserController>) =
    inherit ControllerBase()

    member private this.GetUserId() = UserId(this.User.FindFirst(ClaimTypes.NameIdentifier).Value)

    [<HttpGet>]
    [<Route("get")>]
    member this.Get([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = UserId(id)
            match! userService.Get(userId) with
            | Error(ex) -> 
                logger.LogError(ex, "Cannot get user")
                return (BadRequestResult() :> IActionResult)
            | Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("search_by_contains")>]
    member this.SearchByContains([<FromQuery(Name = "pattern")>] pattern: string) =
        async {
            match! userService.SearchByContains(pattern) with
            | Error(ex) ->
                logger.LogError(ex, "Search failed")
                return (BadRequestResult() :> IActionResult)
            | Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask
