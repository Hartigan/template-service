namespace Contexts

open DatabaseTypes

type IContext<'T> =
    abstract member Get : IDocumentKey -> Async<Result<'T, GetDocumentFail>>
    abstract member Insert : IDocumentKey * 'T -> Async<Result<unit, InsertDocumentFail>>
    abstract member Update<'TFail> : IDocumentKey * ('T -> Result<'T, 'TFail>) -> Async<Result<unit, UpdateDocumentFail<'TFail>>>
    abstract member Upsert<'TFail> : IDocumentKey * ('T -> Result<'T, 'TFail>) * (unit -> 'T) -> Async<Result<unit, UpsertDocumentFail<'TFail>>>
    abstract member Remove : IDocumentKey -> Async<Result<unit, RemoveDocumentFail>>
    abstract member Exists : IDocumentKey -> Async<Result<bool, ExistsDocumentFail>>