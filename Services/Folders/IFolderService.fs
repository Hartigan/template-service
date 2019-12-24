namespace Services.Folders

open System
open Models.Heads
open Models.Folders
open Models.Identificators

type IFoldersService =
    abstract member Get : FolderId -> Async<Result<FolderModel, GetFail>>
    abstract member GetRoot : UserId -> Async<Result<FolderModel, GetFail>>
    abstract member CreateFolder : FolderName * UserId -> Async<Result<FolderId, CreateFolderFail>>
    abstract member AddFolder : target:FolderId * destination:FolderId -> Async<Result<unit, AddFail>>
    abstract member AddHead : target:HeadId * destination:FolderId-> Async<Result<unit, AddFail>>
    abstract member MoveHeadToTrash : HeadId * UserId-> Async<Result<unit, MoveTrashFail>>
    abstract member MoveFolderToTrash : FolderId * UserId -> Async<Result<unit, MoveTrashFail>>
    abstract member RenameFolder: FolderId * FolderName-> Async<Result<unit, RenameFail>>
    abstract member RenameHeadLink: target:FolderId * link:HeadId * HeadName -> Async<Result<unit, RenameFail>>
    abstract member RenameFolderLink: target:FolderId * link:FolderId * FolderName-> Async<Result<unit, RenameFail>>
 