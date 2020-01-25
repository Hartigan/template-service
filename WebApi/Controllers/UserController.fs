namespace WebApi

open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Authorization
open Services.Permissions
open Models.Identificators
open System.Security.Claims

[<Authorize>]
[<Route("user")>]
type UserController(userService: IUserService) =
    inherit ControllerBase()

    member private this.GetUserId() = UserId(this.User.FindFirst(ClaimTypes.NameIdentifier).Value)

    [<HttpGet>]
    [<Route("get")>]
    member this.Get([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = UserId(id)
            match! userService.Get(userId) with
            | Result.Error(fail) ->
                match fail with
                | GetUserFail.Error(error) -> return (BadRequestResult() :> IActionResult)
            | Result.Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("search_by_contains")>]
    member this.SearchByContains([<FromQuery(Name = "pattern")>] pattern: string) =
        async {
            match! userService.SearchByContains(pattern) with
            | Result.Error(fail) ->
                match fail with
                | GetUserFail.Error(error) -> return (BadRequestResult() :> IActionResult)
            | Result.Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask
