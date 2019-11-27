namespace Services.Folders

open System
open Models.Heads
open Models.Folders
open Models.Permissions
open Models.Identificators
open DatabaseTypes
open Contexts
open System.Collections.Generic
open Services.Permissions

type FoldersService(folderContext: FolderContext,
                    headContext: HeadContext,
                    permissionsService: IPermissionsService) =

    let folderContext = (folderContext :> IContext<Folder>)
    let headContext = (headContext :> IContext<Head>)

    interface IFoldersService with
        member this.AddFolder(folderId, parentId, userId) =
            async {
                let folderDocId = Folder.CreateDocumentKey(folderId.Value)
                let! getFolderResult = folderContext.Get(folderDocId)
                match getFolderResult with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) -> return Result.Error(AddFail.Error(error))
                | Result.Ok(folder) ->
                    if not (permissionsService.CheckPermissions(PermissionsModel(folder.Permissions), userId)) then
                        return Result.Error(AddFail.Unauthorized())
                    else
                        let docId = Folder.CreateDocumentKey(parentId.Value)
                        let! result = folderContext.Update(docId, fun parent ->
                            let index = parent.Folders.FindIndex(fun link -> FolderId(link.Id) == folderId)
                            if index < 0 then
                                parent.Folders.Add({ FolderLink.Id = folderId.Value; Name = folder.Name })
                                Result.Ok(parent)
                            else
                                Result.Error(AddFail.Error(InvalidOperationException(sprintf "Folder link %s already exists" folderId.Value))))

                        match result with
                        | Result.Ok(ok) -> return Result.Ok()
                        | Result.Error(fail) ->
                            match fail with
                            | UpdateDocumentFail.Error(error) -> return Result.Error(AddFail.Error(error))
                            | UpdateDocumentFail.CustomFail(fail) -> return Result.Error(fail)
            }

        member this.AddHead(headId, parentId, userId) =
            async {
                let headDocId = Head.CreateDocumentKey(headId.Value)
                let! getHeadResult = headContext.Get(headDocId)
                match getHeadResult with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) -> return Result.Error(AddFail.Error(error))
                | Result.Ok(head) ->
                    if not (permissionsService.CheckPermissions(PermissionsModel(head.Permissions), userId)) then
                        return Result.Error(AddFail.Unauthorized())
                    else
                        let docId = Folder.CreateDocumentKey(parentId.Value)
                        let! result = folderContext.Update(docId, fun parent ->
                            let index = parent.Heads.FindIndex(fun link -> HeadId(link.Id) == headId)
                            if index < 0 then
                                parent.Heads.Add({ HeadLink.Id = headId.Value; Name = head.Name })
                                Result.Ok(parent)
                            else
                                Result.Error(AddFail.Error(InvalidOperationException(sprintf "Head link %s already exists" headId.Value))))

                        match result with
                        | Result.Ok(ok) -> return Result.Ok()
                        | Result.Error(fail) ->
                            match fail with
                            | UpdateDocumentFail.Error(error) -> return Result.Error(AddFail.Error(error))
                            | UpdateDocumentFail.CustomFail(fail) -> return Result.Error(fail)
            }

        member this.CreateFolder(name, userId) = 
            async {
                let folder = { 
                    Folder.Id = Guid.NewGuid().ToString()
                    Name = name.Name
                    Permissions = { Permissions.OwnerId = userId.Value }
                    Heads = List<HeadLink>()
                    Folders = List<FolderLink>()
                }

                let! result = folderContext.Insert(folder, folder)

                match result with
                | Result.Error(fail) ->
                    match fail with
                    | InsertDocumentFail.Error(error) ->
                        return Result.Error(CreateFolderFail.Error(error))
                | Result.Ok(ok) ->
                    return Result.Ok(FolderModel(folder))
            }

        member this.GetRoot(userId) = 
            (this :> IFoldersService).Get(FolderId(userId.Value), userId)

        member this.MoveFolderToTrash(folderId, userId) = 
            failwith "Not Implemented"
        member this.MoveHeadToTrash(headId, userId) = 
            failwith "Not Implemented"

        member this.RenameFolderLink(folderId, folderLinkId, folderName, userId): Async<Result<unit,RenameFail>> = 
            async {
                let docId = Folder.CreateDocumentKey(folderId.Value)
                let! result = folderContext.Update(docId, fun folder ->
                    if not (permissionsService.CheckPermissions(PermissionsModel(folder.Permissions), userId)) then
                        Result.Error(RenameFail.Unauthorized())
                    else
                        let index = folder.Folders.FindIndex(fun link -> FolderId(link.Id) == folderLinkId)
                        if index < 0 then
                            Result.Error(RenameFail.Error(InvalidOperationException(sprintf "Folder link %s not found" folderLinkId.Value)))
                        else
                            let oldLink = folder.Folders.[index]
                            folder.Folders.[index] <- { oldLink with Name = folderName.Name }
                            Result.Ok(folder)
                )

                match result with
                | Result.Ok(ok) -> return Result.Ok()
                | Result.Error(fail) ->
                    match fail with
                    | UpdateDocumentFail.Error(error) -> return Result.Error(RenameFail.Error(error))
                    | UpdateDocumentFail.CustomFail(fail) -> return Result.Error(fail)
            }

        member this.RenameHeadLink(folderId, headLinkId, headName, userId) = 
            async {
                let docId = Folder.CreateDocumentKey(folderId.Value)
                let! result = folderContext.Update(docId, fun folder ->
                    if not (permissionsService.CheckPermissions(PermissionsModel(folder.Permissions), userId)) then
                        Result.Error(RenameFail.Unauthorized())
                    else
                        let index = folder.Heads.FindIndex(fun link -> HeadId(link.Id) == headLinkId)
                        if index < 0 then
                            Result.Error(RenameFail.Error(InvalidOperationException(sprintf "Head link %s not found" headLinkId.Value)))
                        else
                            let oldLink = folder.Heads.[index]
                            folder.Heads.[index] <- { oldLink with Name = headName.Name }
                            Result.Ok(folder))

                match result with
                | Result.Ok(ok) -> return Result.Ok()
                | Result.Error(fail) ->
                    match fail with
                    | UpdateDocumentFail.Error(error) -> return Result.Error(RenameFail.Error(error))
                    | UpdateDocumentFail.CustomFail(fail) -> return Result.Error(fail)
            }

        member this.RenameFolder(folderId, folderName, userId) =
            async {
                let docId = Folder.CreateDocumentKey(folderId.Value)
                let! result = folderContext.Update(docId, fun folder -> 
                    if not (permissionsService.CheckPermissions(PermissionsModel(folder.Permissions), userId)) then
                        Result.Error(RenameFail.Unauthorized())
                    else
                        Result.Ok({ folder with Name = folderName.Name })
                )

                match result with
                | Result.Ok(ok) -> return Result.Ok()
                | Result.Error(fail) ->
                    match fail with
                    | UpdateDocumentFail.Error(error) -> return Result.Error(RenameFail.Error(error))
                    | UpdateDocumentFail.CustomFail(fail) -> return Result.Error(fail)
            }

        member this.Get(folderId, userId) =
            async {
                let docId = Folder.CreateDocumentKey(folderId.Value)
                let! result = folderContext.Get(docId)

                match result with
                | Result.Ok(folder) ->
                    if not (permissionsService.CheckPermissions(PermissionsModel(folder.Permissions), userId)) then
                        return Result.Error(GetFail.Unauthorized())
                    else
                        return Result.Ok(FolderModel(folder))
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) -> return Result.Error(GetFail.Error(error))
            }