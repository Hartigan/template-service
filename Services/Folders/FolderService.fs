namespace Services.Folders

open System
open Models.Heads
open Models.Folders
open Models.Permissions
open Models.Identificators
open DatabaseTypes
open Contexts

type FoldersService(folderContext: IContext<Folder>,
                    headContext: IContext<Head>) =

    interface IFoldersService with
        member this.AddFolder(folderId, parentId) =
            async {
                let folderDocId = Folder.CreateDocumentKey(folderId.Value)
                match! folderContext.Get(folderDocId) with
                | Error(ex) -> return Error(ex)
                | Ok(folder) ->
                    return! folderContext.Update(Folder.CreateDocumentKey(parentId.Value), fun parent ->
                        let contains =
                            parent.Folders
                            |> Seq.exists(fun link -> FolderId(link.Id) = folderId)
                        if not contains then
                            Ok({parent with Folders = parent.Folders @ [{ FolderLink.Id = folderId.Value; Name = folder.Name }] })
                        else
                            Error(InvalidOperationException(sprintf "Folder link %s already exists" folderId.Value) :> Exception))
            }

        member this.AddHead(headId, parentId) =
            async {
                match! headContext.Get(Head.CreateDocumentKey(headId.Value)) with
                | Error(ex) -> return Error(ex)
                | Ok(head) ->
                    return! folderContext.Update(Folder.CreateDocumentKey(parentId.Value), fun parent ->
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
                            Error(InvalidOperationException(sprintf "Head link %s already exists" headId.Value) :> Exception))
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
                | Error(ex) -> return Error(ex)
                | Ok(ok) -> return Ok(FolderId(folder.Id))
            }

        member this.GetRoot(userId) =
            async {
                match! (this :> IFoldersService).Get(FolderId(userId.Value)) with
                | Ok(model) -> return Ok(model)
                | Error(fail) ->
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
                    | Error(ex) -> return Error(ex)
                    | Ok() -> return FolderModel.Create(folder)
            }
            

        member this.MoveFolderToTrash(folderId, userId) = 
            failwith "Not Implemented"
        member this.MoveHeadToTrash(headId, userId) = 
            failwith "Not Implemented"

        member this.RenameFolderLink(folderId, folderLinkId, folderName): Async<Result<unit, Exception>> = 
            folderContext.Update(Folder.CreateDocumentKey(folderId.Value), fun folder ->
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

        member this.RenameHeadLink(folderId, headLinkId, headName) = 
            folderContext.Update(Folder.CreateDocumentKey(folderId.Value), fun folder ->
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

        member this.RenameFolder(folderId, folderName) =
            folderContext.Update(Folder.CreateDocumentKey(folderId.Value), fun folder -> 
                { folder with Name = folderName.Value }
            )

        member this.Get(folderId) =
            async {
                let docId = Folder.CreateDocumentKey(folderId.Value)
                let! result = folderContext.Get(docId)

                match result with
                | Ok(folder) -> return FolderModel.Create(folder)
                | Error(ex) -> return Error(ex)
            }
