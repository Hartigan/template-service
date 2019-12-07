namespace Services.Folders

open System

type GetFail =
    | Error of Exception

type CreateFolderFail =
    | Error of Exception

type AddFail =
    | Error of Exception

type RenameFail =
    | Error of Exception

type MoveTrashFail =
    | Error of Exception

type MoveFolderToTrashFail =
    | Error of Exception