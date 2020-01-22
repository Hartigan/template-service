namespace Contexts

open DatabaseTypes

type IContext<'T> =
    abstract member Get : IDocumentKey -> Async<Result<'T, GetDocumentFail>>
    abstract member Insert : IDocumentKey * 'T -> Async<Result<unit, InsertDocumentFail>>
    abstract member Update<'TFail> : IDocumentKey * ('T -> Result<'T, 'TFail>) -> Async<Result<unit, GenericUpdateDocumentFail<'TFail>>>
    abstract member Update : IDocumentKey * ('T -> 'T) -> Async<Result<unit, UpdateDocumentFail>>
    abstract member Remove : IDocumentKey -> Async<Result<unit, RemoveDocumentFail>>
    abstract member Exists : IDocumentKey -> Async<Result<bool, ExistsDocumentFail>>