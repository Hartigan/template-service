namespace Services.Folders

open System
open Models.Heads
open Models.Folders
open Models.Permissions
open Models.Identificators
open DatabaseTypes
open Contexts

type FoldersService(folderContext: FolderContext,
                    headContext: HeadContext) =

    let folderContext = (folderContext :> IContext<Folder>)
    let headContext = (headContext :> IContext<Head>)

    interface IFoldersService with
        member this.AddFolder(folderId, parentId) =
            async {
                let folderDocId = Folder.CreateDocumentKey(folderId.Value)
                let! getFolderResult = folderContext.Get(folderDocId)
                match getFolderResult with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) -> return Result.Error(AddFail.Error(error))
                | Result.Ok(folder) ->
                    let docId = Folder.CreateDocumentKey(parentId.Value)
                    let! result = folderContext.Update(docId, fun parent ->
                        let contains =
                            parent.Folders
                            |> Seq.exists(fun link -> FolderId(link.Id) = folderId)
                        if not contains then
                            Result.Ok({parent with Folders = parent.Folders @ [{ FolderLink.Id = folderId.Value; Name = folder.Name }] })
                        else
                            Result.Error(AddFail.Error(InvalidOperationException(sprintf "Folder link %s already exists" folderId.Value))))

                    match result with
                    | Result.Ok(ok) -> return Result.Ok()
                    | Result.Error(fail) ->
                        match fail with
                        | GenericUpdateDocumentFail.Error(error) -> return Result.Error(AddFail.Error(error))
                        | GenericUpdateDocumentFail.CustomFail(fail) -> return Result.Error(fail)
            }

        member this.AddHead(headId, parentId) =
            async {
                let headDocId = Head.CreateDocumentKey(headId.Value)
                let! getHeadResult = headContext.Get(headDocId)
                match getHeadResult with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) -> return Result.Error(AddFail.Error(error))
                | Result.Ok(head) ->
                    let docId = Folder.CreateDocumentKey(parentId.Value)
                    let! result = folderContext.Update(docId, fun parent ->
                        let exists =
                            parent.Heads
                            |> Seq.exists(fun link -> HeadId(link.Id) = headId)
                        if not exists then
                            Ok({
                                parent with
                                    Heads =
                                        parent.Heads @ [{
                                            HeadLink.Id = headId.Value
                                            Name = head.Name
                                            Type = head.Commit.Target.Type
                                        }]
                            })
                        else
                            Result.Error(AddFail.Error(InvalidOperationException(sprintf "Head link %s already exists" headId.Value))))

                    match result with
                    | Result.Ok(ok) -> return Result.Ok()
                    | Result.Error(fail) ->
                        match fail with
                        | GenericUpdateDocumentFail.Error(error) -> return Result.Error(AddFail.Error(error))
                        | GenericUpdateDocumentFail.CustomFail(fail) -> return Result.Error(fail)
            }

        member this.CreateFolder(name, userId) = 
            async {
                let folder = { 
                    Folder.Id = Guid.NewGuid().ToString()
                    Name = name.Value
                    Permissions = {
                        Permissions.OwnerId = userId.Value
                        Groups = []
                        Members = []
                    }
                    Heads = []
                    Folders = []
                }

                let! result = folderContext.Insert(folder, folder)

                match result with
                | Result.Error(fail) ->
                    match fail with
                    | InsertDocumentFail.Error(error) ->
                        return Result.Error(CreateFolderFail.Error(error))
                | Result.Ok(ok) ->
                    return Result.Ok(FolderId(folder.Id))
            }

        member this.GetRoot(userId) =
            async {
                match! (this :> IFoldersService).Get(FolderId(userId.Value)) with
                | Ok(model) -> return Ok(model)
                | Result.Error(fail) ->
                    let folder = {
                        Folder.Id = userId.Value
                        Name = "root"
                        Permissions = {
                            Permissions.OwnerId = userId.Value
                            Groups = []
                            Members = []
                        }
                        Folders = []
                        Heads = []
                    }

                    match! folderContext.Insert(folder, folder) with
                    | Result.Error(fail) ->
                        match fail with
                        | InsertDocumentFail.Error(error) -> return Result.Error(GetFail.Error(error))
                    | Ok() ->
                        match FolderModel.Create(folder) with
                        | Ok(folderModel) -> return Ok(folderModel)
                        | Result.Error() -> return Result.Error(GetFail.Error(InvalidOperationException("Cannot create FolderModel")))
            }
            

        member this.MoveFolderToTrash(folderId, userId) = 
            failwith "Not Implemented"
        member this.MoveHeadToTrash(headId, userId) = 
            failwith "Not Implemented"

        member this.RenameFolderLink(folderId, folderLinkId, folderName): Async<Result<unit,RenameFail>> = 
            async {
                let docId = Folder.CreateDocumentKey(folderId.Value)
                let! result = folderContext.Update(docId, fun folder ->
                   {
                        folder with
                            Folders =
                                folder.Folders
                                |> Seq.map(fun x ->
                                    if FolderId(x.Id) = folderLinkId then
                                        { x with Name = folderName.Value }
                                    else
                                        x
                                )
                                |> List.ofSeq
                    }
                )

                match result with
                | Result.Ok(ok) -> return Result.Ok()
                | Result.Error(fail) ->
                    match fail with
                    | UpdateDocumentFail.Error(error) -> return Result.Error(RenameFail.Error(error))
            }

        member this.RenameHeadLink(folderId, headLinkId, headName) = 
            async {
                let docId = Folder.CreateDocumentKey(folderId.Value)
                let! result = folderContext.Update(docId, fun folder ->
                   {
                        folder with
                            Heads =
                                folder.Heads
                                |> Seq.map(fun x ->
                                    if HeadId(x.Id) = headLinkId then
                                        { x with Name = headName.Value }
                                    else
                                        x
                                )
                                |> List.ofSeq
                    }
                )

                match result with
                | Result.Ok(ok) -> return Result.Ok()
                | Result.Error(fail) ->
                    match fail with
                    | UpdateDocumentFail.Error(error) -> return Result.Error(RenameFail.Error(error))
            }

        member this.RenameFolder(folderId, folderName) =
            async {
                let docId = Folder.CreateDocumentKey(folderId.Value)
                let! result = folderContext.Update(docId, fun folder -> 
                    { folder with Name = folderName.Value }
                )
                match result with
                | Result.Ok(ok) -> return Result.Ok()
                | Result.Error(fail) ->
                    match fail with
                    | UpdateDocumentFail.Error(error) -> return Result.Error(RenameFail.Error(error))
            }

        member this.Get(folderId) =
            async {
                let docId = Folder.CreateDocumentKey(folderId.Value)
                let! result = folderContext.Get(docId)

                match result with
                | Result.Ok(folder) ->
                    match FolderModel.Create(folder) with
                        | Ok(folderModel) -> return Ok(folderModel)
                        | Result.Error() -> return Result.Error(GetFail.Error(InvalidOperationException("Cannot create FolderModel")))
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) -> return Result.Error(GetFail.Error(error))
            }
