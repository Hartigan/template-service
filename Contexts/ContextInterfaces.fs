namespace Contexts

open DatabaseTypes
open System

type IContext<'T> =
    abstract member Get : IDocumentKey -> Async<Result<'T, Exception>>
    abstract member Insert : IDocumentKey * 'T -> Async<Result<unit, Exception>>
    abstract member Update : IDocumentKey * ('T -> Result<'T, Exception>) -> Async<Result<unit, Exception>>
    abstract member Update : IDocumentKey * ('T -> 'T) -> Async<Result<unit, Exception>>
    abstract member Remove : IDocumentKey -> Async<Result<unit, Exception>>
    abstract member Exists : IDocumentKey -> Async<Result<bool, Exception>>

type IPermissionsContext =
    abstract member Get : IDocumentKey -> Async<Result<Permissions, Exception>>
    abstract member Update : IDocumentKey * (Permissions -> Result<Permissions, Exception>) -> Async<Result<unit, Exception>>
    abstract member Update : IDocumentKey * (Permissions -> Permissions) -> Async<Result<unit, Exception>>
    abstract member Exists : IDocumentKey -> Async<Result<bool, Exception>>

type IUserContext =
    inherit IContext<User>
    abstract member GetByName : string -> Async<Result<User, Exception>>
    abstract member SearchByContainsInName : string -> Async<Result<List<User>, Exception>>

type IUserRoleContext =
    inherit IContext<UserRole>
    abstract member GetByName : string -> Async<Result<UserRole, Exception>>

type IGroupContext =
    inherit IContext<UserGroup>
    abstract member SearchByContainsInName : string -> Async<Result<List<UserGroup>, Exception>>