namespace Models.Authentication

module ExceptionExtensions =
    open System
    open Microsoft.AspNetCore.Identity

    type Exception with
        member this.ToIdentityResult() =
            let identityError = IdentityError()
            identityError.Code <- this.HResult.ToString()
            identityError.Description <- this.Message
            IdentityResult.Failed(identityError)
