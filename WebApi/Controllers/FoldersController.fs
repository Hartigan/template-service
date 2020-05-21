namespace WebApi

open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Authorization
open Services.Folders
open Services.Permissions
open DatabaseTypes.Identificators
open System
open Models.Folders
open System.Threading.Tasks
open Models.Heads
open System.Security.Claims
open System.Text.Json.Serialization
open Models.Permissions
open Microsoft.Extensions.Logging
open Utils.ResultHelper

type CreateFolderRequest = {
    [<JsonPropertyName("name")>]
    Name: FolderName
    [<JsonPropertyName("destination_id")>]
    DestinationId: FolderId
}

type MoveHeadToTrashRequest = {
    [<JsonPropertyName("parent_id")>]
    ParentId: FolderId
    [<JsonPropertyName("target_id")>]
    TargetId: HeadId
}

type MoveFolderToTrashRequest = {
    [<JsonPropertyName("parent_id")>]
    ParentId: FolderId
    [<JsonPropertyName("target_id")>]
    TargetId: FolderId
}

type RestoreHeadRequest = {
    [<JsonPropertyName("target_id")>]
    TargetId: HeadId
}

type RestoreFolderRequest = {
    [<JsonPropertyName("target_id")>]
    TargetId: FolderId
}

type MoveHeadRequest = {
    [<JsonPropertyName("head_id")>]
    HeadId: HeadId
    [<JsonPropertyName("source_id")>]
    SourceId: FolderId
    [<JsonPropertyName("destination_id")>]
    DestinationId: FolderId
}

type MoveFolderRequest = {
    [<JsonPropertyName("folder_id")>]
    FolderId: FolderId
    [<JsonPropertyName("source_id")>]
    SourceId: FolderId
    [<JsonPropertyName("destination_id")>]
    DestinationId: FolderId
}

type RenameFolderRequest = {
    [<JsonPropertyName("parent_id")>]
    ParentId: FolderId
    [<JsonPropertyName("target_id")>]
    TargetId: FolderId
    [<JsonPropertyName("name")>]
    Name: FolderName
}

type RenameHeadRequest = {
    [<JsonPropertyName("parent_id")>]
    ParentId: FolderId
    [<JsonPropertyName("head_id")>]
    HeadId: HeadId
    [<JsonPropertyName("name")>]
    Name: HeadName
}

[<Authorize>]
[<Route("folders")>]
type FoldersController(foldersService: IFoldersService,
                       permissionsService: IPermissionsService,
                       logger: ILogger<FoldersController>) =
    inherit ControllerBase()

    member private this.GetUserId() =
        UserId(this.User.FindFirst(ClaimTypes.NameIdentifier).Value)

    [<HttpGet>]
    [<Route("get")>]
    member this.Get([<FromQuery(Name = "folder_id")>] folderId: string) =
        async {
            let userId = this.GetUserId()
            let folderId = FolderId(folderId)
            match! permissionsService.CheckPermissions(ProtectedId.Folder(folderId), userId, AccessModel.CanRead) with
            | Ok() ->
                match! foldersService.Get(folderId) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot get folder")
                    return (BadRequestResult() :> IActionResult)
                | Ok(model) -> return (JsonResult(model) :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("create_folder")>]
    member this.CreateFolder([<FromBody>] req: CreateFolderRequest) =
        async {
            let userId = this.GetUserId()
            let! result =
                foldersService.Create(req.Name, userId)
                |> Async.BindResult(fun folderId ->
                    foldersService.Add(folderId, req.DestinationId)
                )
            match result with
            | Error(ex) ->
                logger.LogError(ex, "Cannot create folder")
                return (BadRequestResult() :> IActionResult)
            | Ok(model) -> return (JsonResult(Id(model)) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("get_root")>]
    member this.GetRoot() =
        async {
            let userId = this.GetUserId()
            let! result = foldersService.GetRoot(userId)
            match result with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get root")
                return (BadRequestResult() :> IActionResult)
            | Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("get_trash")>]
    member this.GetTrash() =
        async {
            let userId = this.GetUserId()
            let! result = foldersService.GetRoot(userId)
            match result with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get trash")
                return (BadRequestResult() :> IActionResult)
            | Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("move_head_to_trash")>]
    member this.MoveHeadToTrash([<FromBody>] req: MoveHeadToTrashRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(ProtectedId.Head(req.TargetId), userId, AccessModel.CanWrite) with
            | Ok() ->
                let! result = foldersService.MoveToTrash(req.ParentId, req.TargetId, userId)
                match result with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot move head to trash")
                    return (BadRequestResult() :> IActionResult)
                | Ok() -> return (OkResult() :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("move_folder_to_trash")>]
    member this.MoveFolderToTrash([<FromBody>] req: MoveFolderToTrashRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(ProtectedId.Folder(req.TargetId), userId, AccessModel.CanWrite) with
            | Ok() ->
                let! result = foldersService.MoveToTrash(req.ParentId, req.TargetId, userId)
                match result with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot move folder to trash")
                    return (BadRequestResult() :> IActionResult)
                | Ok(model) -> return (OkResult() :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex,"Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("restore_folder")>]
    member this.RestoreFolder([<FromBody>] req: RestoreFolderRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(ProtectedId.Folder(req.TargetId), userId, AccessModel.CanWrite) with
            | Ok() ->
                let! result = foldersService.Restore(req.TargetId, userId)
                match result with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot restore folder")
                    return (BadRequestResult() :> IActionResult)
                | Ok(model) -> return (OkResult() :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex,"Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("restore_head")>]
    member this.RestoreHead([<FromBody>] req: RestoreHeadRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(ProtectedId.Head(req.TargetId), userId, AccessModel.CanWrite) with
            | Ok() ->
                let! result = foldersService.Restore(req.TargetId, userId)
                match result with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot restore head")
                    return (BadRequestResult() :> IActionResult)
                | Ok(model) -> return (OkResult() :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex,"Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("move_folder")>]
    member this.MoveFolder([<FromBody>] req: MoveFolderRequest) =
        async {
            let userId = this.GetUserId()
            let permissionsResult =
                seq {
                    permissionsService.CheckPermissions(ProtectedId.Folder(req.FolderId), userId, AccessModel.CanWrite)
                    permissionsService.CheckPermissions(ProtectedId.Folder(req.SourceId), userId, AccessModel.CanWrite)
                    permissionsService.CheckPermissions(ProtectedId.Folder(req.DestinationId), userId, AccessModel.CanWrite)
                }
                |> ResultOfAsyncSeq
            match! permissionsResult with
            | Ok(_) ->
                let! result = foldersService.Move(req.FolderId, req.SourceId, req.DestinationId)
                match result with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot move folder")
                    return (BadRequestResult() :> IActionResult)
                | Ok(model) -> return (OkResult() :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex,"Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("move_head")>]
    member this.MoveHead([<FromBody>] req: MoveHeadRequest) =
        async {
            let userId = this.GetUserId()
            let permissionsResult =
                seq {
                    permissionsService.CheckPermissions(ProtectedId.Head(req.HeadId), userId, AccessModel.CanWrite)
                    permissionsService.CheckPermissions(ProtectedId.Folder(req.SourceId), userId, AccessModel.CanWrite)
                    permissionsService.CheckPermissions(ProtectedId.Folder(req.DestinationId), userId, AccessModel.CanWrite)
                }
                |> ResultOfAsyncSeq
            match! permissionsResult with
            | Ok(_) ->
                let! result = foldersService.Move(req.HeadId, req.SourceId, req.DestinationId)
                match result with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot move head")
                    return (BadRequestResult() :> IActionResult)
                | Ok(model) -> return (OkResult() :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex,"Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("rename_folder")>]
    member this.RenameFolder([<FromBody>] req: RenameFolderRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(ProtectedId.Folder(req.TargetId), userId, AccessModel.CanWrite) with
            | Ok() ->
                let! result =
                    foldersService.Rename(req.TargetId, req.Name)
                    |> Async.BindResult(fun _ ->
                        foldersService.RenameLink(req.ParentId, req.TargetId, req.Name)
                    )
                match result with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot rename folder")
                    return (BadRequestResult() :> IActionResult)
                | Ok(model) -> return (OkResult() :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("rename_head")>]
    member this.RenameHead([<FromBody>] req: RenameHeadRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(ProtectedId.Folder(req.ParentId), userId, AccessModel.CanWrite) with
            | Ok() ->
                let! result =
                    foldersService.Rename(req.HeadId, req.Name)
                    |> Async.BindResult(fun _ ->
                        foldersService.RenameLink(req.ParentId, req.HeadId, req.Name)
                    )
                match result with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot rename head link")
                    return (BadRequestResult() :> IActionResult)
                | Ok(model) -> return (OkResult() :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask
