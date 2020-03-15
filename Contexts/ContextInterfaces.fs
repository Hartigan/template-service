namespace Contexts

open DatabaseTypes

type IContext<'T> =
    abstract member Get : IDocumentKey -> Async<Result<'T, GetDocumentFail>>
    abstract member Insert : IDocumentKey * 'T -> Async<Result<unit, InsertDocumentFail>>
    abstract member Update<'TFail> : IDocumentKey * ('T -> Result<'T, 'TFail>) -> Async<Result<unit, GenericUpdateDocumentFail<'TFail>>>
    abstract member Update : IDocumentKey * ('T -> 'T) -> Async<Result<unit, UpdateDocumentFail>>
    abstract member Remove : IDocumentKey -> Async<Result<unit, RemoveDocumentFail>>
    abstract member Exists : IDocumentKey -> Async<Result<bool, ExistsDocumentFail>>

type IPermissionsContext =
    abstract member Get : IDocumentKey -> Async<Result<Permissions, GetDocumentFail>>
    abstract member Update<'TFail> : IDocumentKey * (Permissions -> Result<Permissions, 'TFail>) -> Async<Result<unit, GenericUpdateDocumentFail<'TFail>>>
    abstract member Update : IDocumentKey * (Permissions -> Permissions) -> Async<Result<unit, UpdateDocumentFail>>
    abstract member Exists : IDocumentKey -> Async<Result<bool, ExistsDocumentFail>>

type IUserContext =
    inherit IContext<User>
    abstract member GetByName : string -> Async<Result<User, GetDocumentFail>>
    abstract member SearchByContainsInName : string -> Async<Result<List<User>, GetDocumentFail>>

type IUserRoleContext =
    inherit IContext<UserRole>
    abstract member GetByName : string -> Async<Result<UserRole, GetDocumentFail>>

type ISubmissionContext =
    inherit IContext<Submission>
    abstract member GetByUser : string -> Async<Result<List<Submission>, GetDocumentFail>>

type IReportContext =
    inherit IContext<Report>
    abstract member GetByUser : string -> Async<Result<List<Report>, GetDocumentFail>>

type IGroupContext =
    inherit IContext<UserGroup>
    abstract member GetByUser : string -> Async<Result<List<UserGroup>, GetDocumentFail>>
    abstract member SearchByContainsInName : string -> Async<Result<List<UserGroup>, GetDocumentFail>>