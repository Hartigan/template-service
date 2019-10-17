namespace Models.Authentication

open Domain
open System

module Converters =
    type UserIdentity with
        member this.ToEntity() =
            let result = User()
            result.Id                   <- this.Id.ToString()
            result.FirstName            <- this.FirstName
            result.LastName             <- this.LastName
            result.Email                <- this.Email
            result.EmailConfirmed       <- this.EmailConfirmed
            result.PasswordHash         <- this.PasswordHash
            result.Name                 <- this.Name
            result.NormalizedName       <- this.NormalizedName
            result.IsAuthenticated      <- this.IsAuthenticated
            result.AuthenticationType   <- this.AuthenticationType
            result

    type User with
        member this.ToModel() =
            let result = UserIdentity()
            result.Id                   <- Guid.Parse(this.Id)
            result.FirstName            <- this.FirstName
            result.LastName             <- this.LastName
            result.Email                <- this.Email
            result.EmailConfirmed       <- this.EmailConfirmed
            result.PasswordHash         <- this.PasswordHash
            result.Name                 <- this.Name
            result.NormalizedName       <- this.NormalizedName
            result.IsAuthenticated      <- this.IsAuthenticated
            result.AuthenticationType   <- this.AuthenticationType
            result