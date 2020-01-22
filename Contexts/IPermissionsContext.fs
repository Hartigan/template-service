namespace Contexts

open DatabaseTypes

type IPermissionsContext =
    abstract member Get : IDocumentKey -> Async<Result<Permissions, GetDocumentFail>>
    abstract member Update<'TFail> : IDocumentKey * (Permissions -> Result<Permissions, 'TFail>) -> Async<Result<unit, GenericUpdateDocumentFail<'TFail>>>
    abstract member Update : IDocumentKey * (Permissions -> Permissions) -> Async<Result<unit, UpdateDocumentFail>>
    abstract member Exists : IDocumentKey -> Async<Result<bool, ExistsDocumentFail>>