namespace WebApi

type AuthenticationSettings() =
    member val Authority = "" with get, set
    member val Audience = "" with get, set