namespace Models.Authentication

open System

type RoleIdentity() =

    member val Id       = Guid.Empty with get, set
    member val Name     = String.Empty with get, set