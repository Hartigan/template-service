namespace Services.Folders

open System
open Models.Heads
open Models.Folders
open DatabaseTypes.Identificators

type IFoldersService =
    abstract member Get : FolderId -> Async<Result<FolderModel, Exception>>
    abstract member GetRoot : UserId -> Async<Result<FolderModel, Exception>>
    abstract member CreateFolder : FolderName * UserId -> Async<Result<FolderId, Exception>>
    abstract member AddFolder : target:FolderId * destination:FolderId -> Async<Result<unit, Exception>>
    abstract member AddHead : target:HeadId * destination:FolderId-> Async<Result<unit, Exception>>
    abstract member MoveHeadToTrash : parent:FolderId * HeadId * UserId-> Async<Result<unit, Exception>>
    abstract member MoveFolderToTrash : parent:FolderId * FolderId * UserId -> Async<Result<unit, Exception>>
    abstract member RenameFolder: FolderId * FolderName-> Async<Result<unit, Exception>>
    abstract member RenameHead: HeadId * HeadName -> Async<Result<unit, Exception>>
    abstract member RenameHeadLink: target:FolderId * link:HeadId * HeadName -> Async<Result<unit, Exception>>
    abstract member RenameFolderLink: target:FolderId * link:FolderId * FolderName-> Async<Result<unit, Exception>>
 