namespace WebApi

open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Authorization
open Services.Folders
open Services.Permissions
open Models.Identificators
open System
open Models.Folders
open System.Threading.Tasks
open Models.Heads
open System.Security.Claims
open System.Text.Json.Serialization

type CreateFolderRequest = {
    [<JsonPropertyName("name")>]
    Name: FolderName
}

type AddFolderRequest = {
    [<JsonPropertyName("target_id")>]
    TargetId: FolderId
    [<JsonPropertyName("destination_id")>]
    DestinationId: FolderId
}

type AddHeadRequest = {
    [<JsonPropertyName("target_id")>]
    TargetId: HeadId
    [<JsonPropertyName("destination_id")>]
    DestinationId: FolderId
}

type MoveHeadToTrashRequest = {
    [<JsonPropertyName("target_id")>]
    TargetId: HeadId
}

type MoveFolderToTrashRequest = {
    [<JsonPropertyName("target_id")>]
    TargetId: FolderId
}

type RenameFolderRequest = {
    [<JsonPropertyName("target_id")>]
    TargetId: FolderId
    [<JsonPropertyName("name")>]
    Name: FolderName
}

type RenameFolderLinkRequest = {
    [<JsonPropertyName("parent_id")>]
    ParentId: FolderId
    [<JsonPropertyName("link_id")>]
    LinkId: FolderId
    [<JsonPropertyName("name")>]
    Name: FolderName
}

type RenameHeadLinkRequest = {
    [<JsonPropertyName("parent_id")>]
    ParentId: FolderId
    [<JsonPropertyName("link_id")>]
    LinkId: HeadId
    [<JsonPropertyName("name")>]
    Name: HeadName
}

[<Authorize>]
[<Route("folders")>]
type FoldersController(foldersService: IFoldersService, permissionsService: IPermissionsService) =
    inherit ControllerBase()

    member private this.GetUserId() =
        UserId(this.User.FindFirst(ClaimTypes.NameIdentifier).Value)

    [<HttpGet>]
    [<Route("get")>]
    member this.Get([<FromQuery(Name = "folder_id")>] folderId: string) =
        async {
            let userId = this.GetUserId()
            let folderId = FolderId(folderId)
            match! permissionsService.CheckPermissions(folderId, userId) with
            | Ok() ->
                match! foldersService.Get(folderId) with
                | Result.Error(fail) ->
                    match fail with
                    | GetFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Result.Ok(model) -> return (JsonResult(model) :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("create_folder")>]
    member this.CreateFolder([<FromBody>] req: CreateFolderRequest) =
        async {
            let userId = this.GetUserId()
            let! result = foldersService.CreateFolder(req.Name, userId)
            match result with
            | Result.Error(fail) ->
                match fail with
                | CreateFolderFail.Error(error) -> return (BadRequestResult() :> IActionResult)
            | Result.Ok(model) -> return (JsonResult(Id(model)) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("add_folder")>]
    member this.AddFolder([<FromBody>] req: AddFolderRequest) =
        async {
            let userId = this.GetUserId()
            let! targetCheck = permissionsService.CheckPermissions(req.TargetId, userId)
            let! destinationCheck = permissionsService.CheckPermissions(req.DestinationId, userId)

            match (targetCheck, destinationCheck) with
            | (Ok(), Ok()) ->
                let! result = foldersService.AddFolder(req.TargetId, req.DestinationId)
                match result with
                | Result.Error(fail) ->
                    match fail with
                    | AddFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Result.Ok(model) -> return (JsonResult(model) :> IActionResult)
            | _ ->  return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("add_head")>]
    member this.AddHead([<FromBody>] req: AddHeadRequest) =
        async {
            let userId = this.GetUserId()
            let! targetCheck = permissionsService.CheckPermissions(req.TargetId, userId)
            let! destinationCheck = permissionsService.CheckPermissions(req.DestinationId, userId)

            match (targetCheck, destinationCheck) with
            | (Ok(), Ok()) ->
                let! result = foldersService.AddHead(req.TargetId, req.DestinationId)
                match result with
                | Result.Error(fail) ->
                    match fail with
                    | AddFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Result.Ok(model) -> return (JsonResult(model) :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("get_root")>]
    member this.GetRoot() =
        async {
            let userId = this.GetUserId()
            let! result = foldersService.GetRoot(userId)
            match result with
            | Result.Error(fail) ->
                match fail with
                | GetFail.Error(error) -> return (BadRequestResult() :> IActionResult)
            | Result.Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("move_head_to_trash")>]
    member this.MoveHeadToTrash([<FromBody>] req: MoveHeadToTrashRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(req.TargetId, userId) with
            | Ok() ->
                let! result = foldersService.MoveHeadToTrash(req.TargetId, userId)
                match result with
                | Result.Error(fail) ->
                    match fail with
                    | MoveTrashFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Result.Ok() -> return (OkResult() :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("move_folder_to_trash")>]
    member this.MoveFolderToTrash([<FromBody>] req: MoveFolderToTrashRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(req.TargetId, userId) with
            | Ok() ->
                let! result = foldersService.MoveFolderToTrash(req.TargetId, userId)
                match result with
                | Result.Error(fail) ->
                    match fail with
                    | MoveTrashFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Result.Ok(model) -> return (OkResult() :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("rename_folder")>]
    member this.RenameFolder([<FromBody>] req: RenameFolderRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(req.TargetId, userId) with
            | Ok() ->
                let! result = foldersService.RenameFolder(req.TargetId, req.Name)
                match result with
                | Result.Error(fail) ->
                    match fail with
                    | RenameFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Result.Ok(model) -> return (OkResult() :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("rename_folder_link")>]
    member this.RenameFolderLink([<FromBody>] req: RenameFolderLinkRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(req.ParentId, userId) with
            | Ok() ->
                let! result = foldersService.RenameFolderLink(req.ParentId, req.LinkId, req.Name)
                match result with
                | Result.Error(fail) ->
                    match fail with
                    | RenameFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Result.Ok(model) -> return (OkResult() :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("rename_head_link")>]
    member this.RenameHeadLink([<FromBody>] req: RenameHeadLinkRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(req.ParentId, userId) with
            | Ok() ->
                let! result = foldersService.RenameHeadLink(req.ParentId, req.LinkId, req.Name)
                match result with
                | Result.Error(fail) ->
                    match fail with
                    | RenameFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Result.Ok(model) -> return (OkResult() :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask
