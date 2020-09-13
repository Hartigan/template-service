namespace WebApi

open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Authorization
open Services.Permissions
open DatabaseTypes.Identificators
open System.Security.Claims
open System
open Microsoft.Extensions.Logging
open System.Text.Json.Serialization

type SearchRequest = {
    [<JsonPropertyName("pattern")>]
    Pattern : string option
    [<JsonPropertyName("offset")>]
    Offset : UInt32
    [<JsonPropertyName("limit")>]
    Limit : UInt32
}

[<Authorize>]
[<Route("user")>]
type UserController(userService: IUserService,
                    logger: ILogger<UserController>) =
    inherit ControllerBase()

    member private this.GetUserId() = UserId(this.User.FindFirst(ClaimTypes.NameIdentifier).Value)

    [<HttpGet>]
    [<Route("init")>]
    member this.Init() =
        async {
            let userId = this.GetUserId()
            match! userService.Init(userId) with
            | Error(ex) -> 
                logger.LogError(ex, "Cannot get user")
                return (BadRequestResult() :> IActionResult)
            | Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask

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

    [<HttpPost>]
    [<Route("search")>]
    member this.Search([<FromBody>] req: SearchRequest) =
        async {
            match! userService.Search(req.Pattern, req.Offset, req.Limit) with
            | Error(ex) ->
                logger.LogError(ex, "Search failed")
                return (BadRequestResult() :> IActionResult)
            | Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask
