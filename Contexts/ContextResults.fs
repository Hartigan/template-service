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

type GenericUpdateDocumentFail<'TFail> =
    | Error of Exception
    | CustomFail of 'TFail

type UpdateDocumentFail =
    | Error of Exception
