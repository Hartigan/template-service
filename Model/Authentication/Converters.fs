namespace Models.Authentication

open DatabaseTypes
open DatabaseTypes.Identificators
open System

module Converters =
    type UserIdentity with
        member this.ToEntity() =
            {
                User.Id              = UserId(this.Id.ToString())
                FirstName            = this.FirstName
                LastName             = this.LastName
                Email                = this.Email
                EmailConfirmed       = this.EmailConfirmed
                PasswordHash         = this.PasswordHash
                Name                 = this.Name
                NormalizedName       = this.NormalizedName
                IsAuthenticated      = this.IsAuthenticated
                AuthenticationType   = this.AuthenticationType
                Roles                = this.Roles
                Type                 = UserType.Instance
            }

    type User with
        member this.ToModel() =
            let result = UserIdentity()
            result.Id                   <- Guid.Parse(this.Id.Value)
            result.FirstName            <- this.FirstName
            result.LastName             <- this.LastName
            result.Email                <- this.Email
            result.EmailConfirmed       <- this.EmailConfirmed
            result.PasswordHash         <- this.PasswordHash
            result.Name                 <- this.Name
            result.NormalizedName       <- this.NormalizedName
            result.IsAuthenticated      <- this.IsAuthenticated
            result.AuthenticationType   <- this.AuthenticationType
            result.Roles                <- this.Roles
            result

    type RoleIdentity with
        member this.ToEntity() =
            {
                UserRole.Id             = this.Id.ToString()
                Name                    = this.Name
                Type                    = UserRoleType.Instance
            }

    type UserRole with
        member this.ToModel() =
            let result = RoleIdentity()
            result.Id                   <- Guid.Parse(this.Id)
            result.Name                 <- this.Name
            result