namespace Services.Folders

open System
open Services

type GetFail =
    | Error of Exception
    | Unauthorized of unit

type CreateFolderFail =
    | Error of Exception

type AddFail =
    | Error of Exception
    | Unauthorized of unit

type RenameFail =
    | Error of Exception
    | Unauthorized of unit

type MoveTrashFail =
    | Error of Exception
    | Unauthorized of unit

type MoveFolderToTrashFail =
    | Error of Exception
    | Unauthorized of unit