namespace Contexts

open System

type GetDocumentFail =
    | Error of Exception

type InsertDocumentFail =
    | Error of Exception

type RemoveDocumentFail =
    | Error of Exception

type ExistsDocumentFail =
    | Error of Exception

type UpdateDocumentFail<'TFail> =
    | Error of Exception
    | CustomFail of 'TFail

type UpsertDocumentFail<'TFail> =
    | Error of Exception
    | CustomFail of 'TFail