namespace WebApi

open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Authorization

[<Route("identity")>]
[<Authorize>]
type IdentityController() =
    inherit ControllerBase()

    [<HttpGet>]
    member this.Get() =
        JsonResult(this.User.Claims)