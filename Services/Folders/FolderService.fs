namespace Services.Folders

open System
open Models.Heads
open Models.Folders
open Models.Permissions
open Models.Trash
open DatabaseTypes.Identificators
open Services.Permissions
open DatabaseTypes
open Contexts
open Utils.ResultHelper
open FSharp.Control
open FSharpx.Control
open Services.VersionControl

type FoldersService(folderContext: IContext<Folder>,
                    headContext: IContext<Head>,
                    trashContext: IContext<Trash>,
                    permissionsService: IPermissionsService) =

    interface IFoldersService with
        member this.GetTrash(userId: UserId) =
            trashContext.Get(Trash.CreateDocumentKey(userId))
            |> Async.BindResult(fun trash ->
                trash.Folders
                |> Seq.map(fun entry -> folderContext.Get(Folder.CreateDocumentKey(entry.FolderId)))
                |> ResultOfAsyncSeq
                |> Async.MapResult(fun folders ->
                    folders
                    |> Seq.map TrashFolderEntryModel.Create
                    |> List.ofSeq
                )
                |> Async.BindResult(fun folders ->
                    trash.Heads
                    |> Seq.map(fun entry -> headContext.Get(Head.CreateDocumentKey(entry.HeadId)))
                    |> ResultOfAsyncSeq
                    |> Async.TryMapResult(fun heads ->
                        heads
                        |> Seq.map TrashHeadEntryModel.Create
                        |> ResultOfSeq
                    )
                    |> Async.MapResult(fun heads ->
                        TrashModel.Create(heads, folders)
                    )
                )
            )

        member this.Move(headId: HeadId, src: FolderId, dst: FolderId): Async<Result<unit,Exception>> =
            folderContext.Update(Folder.CreateDocumentKey(src), fun parent ->
                let exists = parent.Heads |> Seq.exists(fun link -> link.Id = headId)
                if exists then
                    Ok({
                        parent with
                            Heads =
                                parent.Heads
                                |> Seq.filter(fun link -> link.Id <> headId)
                                |> List.ofSeq
                    })
                else
                    Result.Error(InvalidOperationException(sprintf "Folder %s isn't parent of %s" src.Value headId.Value) :> Exception)
            )
            |> Async.BindResult(fun _ ->
                headContext.Get(Head.CreateDocumentKey(headId))
            )
            |> Async.BindResult(fun head ->
                folderContext.Update(Folder.CreateDocumentKey(dst), fun destination ->
                    {
                        destination with
                            Heads =
                                {
                                    Id = head.Id
                                    Type = head.Commit.Target.Type
                                    Name = head.Name
                                } :: destination.Heads
                    }
                )
            )

        member this.Move(folderId: FolderId, src: FolderId, dst: FolderId): Async<Result<unit,Exception>> = 
            folderContext.Update(Folder.CreateDocumentKey(src), fun parent ->
                let exists = parent.Folders |> Seq.exists(fun link -> link.Id = folderId)
                if exists then
                    Ok({
                        parent with
                            Folders =
                                parent.Folders
                                |> Seq.filter(fun link -> link.Id <> folderId)
                                |> List.ofSeq
                    })
                else
                    Result.Error(InvalidOperationException(sprintf "Folder %s isn't parent of %s" src.Value folderId.Value) :> Exception)
            )
            |> Async.BindResult(fun _ ->
                folderContext.Get(Folder.CreateDocumentKey(folderId))
            )
            |> Async.BindResult(fun folder ->
                folderContext.Update(Folder.CreateDocumentKey(dst), fun destination ->
                    {
                        destination with
                            Folders =
                                {
                                    Id = folder.Id
                                    Name = folder.Name
                                } :: destination.Folders
                    }
                )
            )

        member this.Restore(headId: HeadId, userId: UserId): Async<Result<unit,Exception>> = 
            trashContext.Get(Trash.CreateDocumentKey(userId))
            |> Async.BindResult(fun trash ->
                trash.Heads
                |> Seq.tryFind(fun e -> e.HeadId = headId)
                |> Option.map(fun e ->
                    headContext.Get(Head.CreateDocumentKey(e.HeadId))
                    |> Async.MapResult(fun head ->
                        {
                            HeadLink.Id = head.Id
                            Name        = head.Name
                            Type        = head.Commit.Target.Type
                        }
                    )
                    |> Async.BindResult(fun link ->
                        folderContext.Update(Folder.CreateDocumentKey(e.ParentId), fun parent ->
                            {
                                parent with
                                    Heads = link :: parent.Heads
                            }
                        )
                    )
                )
                |> fun opt ->
                    match opt with
                    | Some(a) ->
                        a
                    | None ->
                        async.Return(Result.Error(InvalidOperationException(sprintf "Head %s isn't in trash" headId.Value) :> Exception))
            )


        member this.Restore(folderId: FolderId, userId: UserId): Async<Result<unit,Exception>> = 
            trashContext.Get(Trash.CreateDocumentKey(userId))
            |> Async.BindResult(fun trash ->
                trash.Folders
                |> Seq.tryFind(fun e -> e.FolderId = folderId)
                |> Option.map(fun e ->
                    folderContext.Get(Folder.CreateDocumentKey(e.FolderId))
                    |> Async.MapResult(fun folder ->
                        {
                            FolderLink.Id   = folder.Id
                            Name            = folder.Name
                        }
                    )
                    |> Async.BindResult(fun link ->
                        folderContext.Update(Folder.CreateDocumentKey(e.ParentId), fun parent ->
                            {
                                parent with
                                    Folders = link :: parent.Folders
                            }
                        )
                    )
                )
                |> fun opt ->
                    match opt with
                    | Some(a) ->
                        a
                    | None ->
                        async.Return(Result.Error(InvalidOperationException(sprintf "Folder %s isn't in trash" folderId.Value) :> Exception))
            )


        member this.Add(folderId: FolderId, parentId: FolderId) =
            folderContext.Get(Folder.CreateDocumentKey(folderId))
            |> Async.BindResult(fun folder ->
                folderContext.Update
                    (Folder.CreateDocumentKey(parentId),
                    fun parent ->
                        let contains =
                            parent.Folders
                            |> Seq.exists(fun link -> link.Id = folderId)
                        if not contains then
                            Ok({
                                parent with
                                    Folders = {
                                        FolderLink.Id       = folderId
                                        Name                = folder.Name
                                    } :: parent.Folders
                            })
                        else
                            Result.Error(InvalidOperationException(sprintf "Folder link %s already exists" folderId.Value) :> Exception))
            )

        member this.Add(headId: HeadId, parentId: FolderId) =
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

        member this.Create(name: FolderName, userId: UserId) = 
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

        member this.MoveToTrash(parentId: FolderId, folderId: FolderId, userId: UserId) =
            folderContext.Update(Folder.CreateDocumentKey(parentId), fun parent ->
                let exists = parent.Folders |> Seq.exists(fun link -> link.Id = folderId)
                if exists then
                    Ok({
                        parent with
                            Folders =
                                parent.Folders
                                |> Seq.filter(fun link -> link.Id <> folderId)
                                |> List.ofSeq
                    })
                else
                    Result.Error(InvalidOperationException(sprintf "Folder %s isn't parent of %s" parentId.Value folderId.Value) :> Exception)
            )
            |> Async.BindResult(fun _ ->
                trashContext.Update(Trash.CreateDocumentKey(userId), fun trash ->
                    {
                        trash with
                            Folders =
                                { ParentId = parentId; FolderId = folderId } :: trash.Folders
                    }
                )
            )

        member this.MoveToTrash(parentId: FolderId, headId: HeadId, userId: UserId) = 
            folderContext.Update(Folder.CreateDocumentKey(parentId), fun parent ->
                let exists = parent.Heads |> Seq.exists(fun link -> link.Id = headId)
                if exists then
                    Ok({
                        parent with
                            Heads =
                                parent.Heads
                                |> Seq.filter(fun link -> link.Id <> headId)
                                |> List.ofSeq
                    })
                else
                    Result.Error(InvalidOperationException(sprintf "Folder %s isn't parent of %s" parentId.Value headId.Value) :> Exception)
            )
            |> Async.BindResult(fun _ ->
                trashContext.Update(Trash.CreateDocumentKey(userId), fun trash ->
                    {
                        trash with
                            Heads =
                                { ParentId = parentId; HeadId = headId } :: trash.Heads
                    }
                )
            )

        member this.RenameLink(folderId: FolderId, folderLinkId: FolderId, folderName: FolderName): Async<Result<unit, Exception>> = 
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

        member this.RenameLink(folderId: FolderId, headLinkId: HeadId, headName: HeadName) = 
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

        member this.Rename(headId: HeadId, headName: HeadName) = 
            headContext.Update(Head.CreateDocumentKey(headId), fun head ->
                {
                    head with
                        Name = headName.Value
                }
            )

        member this.Rename(folderId: FolderId, folderName: FolderName) =
            folderContext.Update(Folder.CreateDocumentKey(folderId), fun folder -> 
                { folder with Name = folderName.Value }
            )

        member this.Get(folderId) =
            folderContext.Get(Folder.CreateDocumentKey(folderId))
            |> Async.TryMapResult FolderModel.Create
