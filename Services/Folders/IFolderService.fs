namespace Services.Folders

open System
open Models.Heads
open Models.Folders
open Models.Trash
open DatabaseTypes.Identificators

type IFoldersService =
    abstract member Get : FolderId -> Async<Result<FolderModel, Exception>>
    abstract member GetRoot : UserId -> Async<Result<FolderModel, Exception>>
    abstract member GetTrash : UserId -> Async<Result<TrashModel, Exception>>
    abstract member Create : FolderName * UserId -> Async<Result<FolderId, Exception>>
    abstract member Add : target:FolderId * destination:FolderId -> Async<Result<unit, Exception>>
    abstract member Add : target:HeadId * destination:FolderId-> Async<Result<unit, Exception>>
    abstract member MoveToTrash : parent:FolderId * HeadId * UserId-> Async<Result<unit, Exception>>
    abstract member MoveToTrash : parent:FolderId * FolderId * UserId -> Async<Result<unit, Exception>>
    abstract member Restore : HeadId * UserId-> Async<Result<unit, Exception>>
    abstract member Restore : FolderId * UserId -> Async<Result<unit, Exception>>
    abstract member Move : HeadId * src:FolderId * dst:FolderId-> Async<Result<unit, Exception>>
    abstract member Move : FolderId * src:FolderId * dst:FolderId -> Async<Result<unit, Exception>>
    abstract member Rename : FolderId * FolderName-> Async<Result<unit, Exception>>
    abstract member Rename : HeadId * HeadName -> Async<Result<unit, Exception>>
    abstract member RenameLink: target:FolderId * link:HeadId * HeadName -> Async<Result<unit, Exception>>
    abstract member RenameLink: target:FolderId * link:FolderId * FolderName-> Async<Result<unit, Exception>>
 