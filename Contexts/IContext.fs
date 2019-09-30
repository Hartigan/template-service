namespace Contexts

open Contexts.Results
open System.Threading.Tasks

type IContext<'T> =
    abstract member Get : IDocumentKey -> Async<Result<'T, GetFail>>
    abstract member Insert : IDocumentKey * 'T -> Async<Result<unit, InsertFail>>
    abstract member Update : IDocumentKey * ('T -> 'T) -> Async<Result<unit, UpdateFail>>
    abstract member Upsert : IDocumentKey * ('T -> 'T) * (unit -> 'T) -> Async<Result<unit, UpsertFail>>
    abstract member Remove : IDocumentKey -> Async<Result<unit, RemoveFail>>