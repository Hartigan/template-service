namespace Models.Authentication

open DatabaseTypes
open System

module Converters =
    type UserIdentity with
        member this.ToEntity() =
            {
                User.Id              = this.Id.ToString()
                FirstName            = this.FirstName
                LastName             = this.LastName
                Email                = this.Email
                EmailConfirmed       = this.EmailConfirmed
                PasswordHash         = this.PasswordHash
                Name                 = this.Name
                NormalizedName       = this.NormalizedName
                IsAuthenticated      = this.IsAuthenticated
                AuthenticationType   = this.AuthenticationType
            }

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

    type RoleIdentity with
        member this.ToEntity() =
            {
                UserRole.Id             = this.Id.ToString()
                Name                    = this.Name
            }

    type UserRole with
        member this.ToModel() =
            let result = RoleIdentity()
            result.Id                   <- Guid.Parse(this.Id)
            result.Name                 <- this.Name
            result