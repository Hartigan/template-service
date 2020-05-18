namespace Services.Folders

open System
open Models.Heads
open Models.Folders
open Models.Permissions
open DatabaseTypes.Identificators
open Services.Permissions
open DatabaseTypes
open Contexts
open Utils.ResultHelper
open FSharp.Control
open FSharpx.Control

type FoldersService(folderContext: IContext<Folder>,
                    headContext: IContext<Head>,
                    permissionsService: IPermissionsService) =

    interface IFoldersService with
        member this.AddFolder(folderId, parentId) =
            folderContext.Get(Folder.CreateDocumentKey(folderId))
            |> Async.BindResult(fun folder ->
                folderContext.Update
                    (Folder.CreateDocumentKey(parentId),
                    fun parent ->
                        let contains =
                            parent.Folders
                            |> Seq.exists(fun link -> link.Id = folderId)
                        if not contains then
                            Ok({parent with Folders = { FolderLink.Id = folderId; Name = folder.Name } :: parent.Folders })
                        else
                            Result.Error(InvalidOperationException(sprintf "Folder link %s already exists" folderId.Value) :> Exception))
            )

        member this.AddHead(headId, parentId) =
            headContext.Get(Head.CreateDocumentKey(headId))
            |> Async.BindResult(fun head ->
                folderContext.Update
                    (Folder.CreateDocumentKey(parentId),
                    fun parent ->
                        let exists =
                            parent.Heads
                            |> Seq.exists(fun link -> link.Id = headId)
                        if not exists then
                            Ok({
                                parent with
                                    Heads =
                                        {
                                            HeadLink.Id = headId
                                            Name = head.Name
                                            Type = head.Commit.Target.Type
                                        } :: parent.Heads
                            })
                        else
                            Result.Error(InvalidOperationException(sprintf "Head link %s already exists" headId.Value) :> Exception)
                    )
            )

        member this.CreateFolder(name, userId) = 
            let folder = { 
                Folder.Id = FolderId(Guid.NewGuid().ToString())
                Type = FolderType.Instance
                Name = name.Value
                Permissions = {
                    Permissions.OwnerId = userId
                    Groups = []
                    Members = []
                }
                Heads = []
                Folders = []
            }
            let folderId = folder.Id

            folderContext.Insert(folder, folder)
            |> Async.BindResult(fun _ -> permissionsService.UserItemsAppend(ProtectedId.Folder(folderId), userId))
            |> Async.MapResult(fun _ -> folderId)

        member this.GetRoot(userId) =
            let folderId = FolderId(userId.Value)
            (this :> IFoldersService).Get(folderId)
            |> Async.bind(fun r ->
                match r with
                | Ok(model) -> async.Return(Ok(model))
                | Result.Error(_) ->
                    let folder = {
                        Folder.Id = folderId
                        Type = FolderType.Instance
                        Name = "root"
                        Permissions = {
                            Permissions.OwnerId = userId
                            Groups = []
                            Members = []
                        }
                        Folders = []
                        Heads = []
                    }
                    folderContext.Insert(folder, folder)
                    |> Async.BindResult(fun _ -> permissionsService.UserItemsAppend(ProtectedId.Folder(folderId), userId))
                    |> Async.map(fun _ -> FolderModel.Create(folder))
            )

        member this.MoveFolderToTrash(folderId, userId) = 
            failwith "Not Implemented"
        member this.MoveHeadToTrash(headId, userId) = 
            failwith "Not Implemented"

        member this.RenameFolderLink(folderId, folderLinkId, folderName): Async<Result<unit, Exception>> = 
            folderContext.Update(Folder.CreateDocumentKey(folderId), fun folder ->
               {
                    folder with
                        Folders =
                            folder.Folders
                            |> Seq.map(fun x ->
                                if x.Id = folderLinkId then
                                    { x with Name = folderName.Value }
                                else
                                    x
                            )
                            |> List.ofSeq
                }
            )

        member this.RenameHeadLink(folderId, headLinkId, headName) = 
            folderContext.Update(Folder.CreateDocumentKey(folderId), fun folder ->
               {
                    folder with
                        Heads =
                            folder.Heads
                            |> Seq.map(fun x ->
                                if x.Id = headLinkId then
                                    { x with Name = headName.Value }
                                else
                                    x
                            )
                            |> List.ofSeq
                }
            )

        member this.RenameFolder(folderId, folderName) =
            folderContext.Update(Folder.CreateDocumentKey(folderId), fun folder -> 
                { folder with Name = folderName.Value }
            )

        member this.Get(folderId) =
            folderContext.Get(Folder.CreateDocumentKey(folderId))
            |> Async.TryMapResult FolderModel.Create
