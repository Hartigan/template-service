namespace Models.Authentication

open System.Security.Principal
open System

[<AllowNullLiteral>]
type UserIdentity() =

    member val Id                   = Guid.Empty with get, set
    member val FirstName            = String.Empty with get, set
    member val LastName             = String.Empty with get, set
    member val Email                = String.Empty with get, set
    member val EmailConfirmed       = false with get, set
    member val PasswordHash         = String.Empty with get, set
    member val Name                 = String.Empty with get, set
    member val NormalizedName       = String.Empty with get, set
    member val IsAuthenticated      = false with get, set
    member val AuthenticationType   = String.Empty with get, set

    interface IIdentity with
        member this.AuthenticationType
            with get() = this.AuthenticationType
        member this.IsAuthenticated
            with get() = this.IsAuthenticated
        member this.Name
            with get() = this.Name