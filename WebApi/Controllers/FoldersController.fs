namespace WebApi

open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Authorization
open Services.Folders
open Models.Identificators
open System
open Models.Folders
open System.Threading.Tasks
open Models.Heads
open System.Security.Claims

[<Authorize>]
[<Route("folders")>]
type FoldersController(foldersService: IFoldersService) =
    inherit ControllerBase()

    member private this.GetUserId() =
        UserId(this.User.FindFirst(ClaimTypes.NameIdentifier).Value)

    [<HttpGet>]
    [<Route("get")>]
    member this.Get([<FromQuery(Name = "folder_id")>] folderId: string) =
        async {
            let userId = this.GetUserId()
            let folderId = FolderId(folderId)
            let! result = foldersService.Get(folderId, userId)
            match result with
            | Result.Error(fail) ->
                match fail with
                | GetFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | GetFail.Unauthorized(_) -> return (UnauthorizedResult() :> IActionResult)
            | Result.Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("create_folder")>]
    member this.CreateFolder([<FromQuery(Name = "folder_name")>] name: string) =
        async {
            let userId = this.GetUserId()
            let folderName = FolderName(name)
            let! result = foldersService.CreateFolder(folderName, userId)
            match result with
            | Result.Error(fail) ->
                match fail with
                | CreateFolderFail.Error(error) -> return (BadRequestResult() :> IActionResult)
            | Result.Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("add_folder")>]
    member this.AddFolder([<FromQuery(Name = "target_id")>] targetId: string,
                          [<FromQuery(Name = "destination_id")>] destinationId: string) =
        async {
            let userId = this.GetUserId()
            let targetFolderId = FolderId(targetId)
            let destinationFolderId = FolderId(destinationId)
            let! result = foldersService.AddFolder(targetFolderId, destinationFolderId, userId)
            match result with
            | Result.Error(fail) ->
                match fail with
                | AddFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | AddFail.Unauthorized(_) -> return (UnauthorizedResult() :> IActionResult)
            | Result.Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("add_head")>]
    member this.AddHead([<FromQuery(Name = "target_id")>] targetId: string,
                        [<FromQuery(Name = "destination_id")>] destinationId: string) =
        async {
            let userId = this.GetUserId()
            let targetHeadId = HeadId(targetId)
            let destinationFolderId = FolderId(destinationId)
            let! result = foldersService.AddHead(targetHeadId, destinationFolderId, userId)
            match result with
            | Result.Error(fail) ->
                match fail with
                | AddFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | AddFail.Unauthorized(_) -> return (UnauthorizedResult() :> IActionResult)
            | Result.Ok(model) -> return (JsonResult(model) :> IActionResult)
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
                | GetFail.Unauthorized(_) -> return (UnauthorizedResult() :> IActionResult)
            | Result.Ok(model) -> return (JsonResult(model) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("move_head_to_trash")>]
    member this.MoveHeadToTrash([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let headId = HeadId(id)
            let! result = foldersService.MoveHeadToTrash(headId, userId)
            match result with
            | Result.Error(fail) ->
                match fail with
                | MoveTrashFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | MoveTrashFail.Unauthorized(_) -> return (UnauthorizedResult() :> IActionResult)
            | Result.Ok() -> return (OkResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("move_folder_to_trash")>]
    member this.MoveFolderToTrash([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let folderId = FolderId(id)
            let! result = foldersService.MoveFolderToTrash(folderId, userId)
            match result with
            | Result.Error(fail) ->
                match fail with
                | MoveTrashFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | MoveTrashFail.Unauthorized(_) -> return (UnauthorizedResult() :> IActionResult)
            | Result.Ok(model) -> return (OkResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("rename_folder")>]
    member this.RenameFolder([<FromQuery(Name = "id")>] id: string, [<FromQuery(Name = "name")>] name: string) =
        async {
            let userId = this.GetUserId()
            let folderId = FolderId(id)
            let folderName = FolderName(name)
            let! result = foldersService.RenameFolder(folderId, folderName, userId)
            match result with
            | Result.Error(fail) ->
                match fail with
                | RenameFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | RenameFail.Unauthorized(_) -> return (UnauthorizedResult() :> IActionResult)
            | Result.Ok(model) -> return (OkResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("rename_folder_link")>]
    member this.RenameFolderLink([<FromQuery(Name = "folder_id")>] folderId: string,
                                 [<FromQuery(Name = "link_id")>] linkId: string,
                                 [<FromQuery(Name = "name")>] name: string) =
        async {
            let userId = this.GetUserId()
            let folderId = FolderId(folderId)
            let linkId = FolderId(linkId)
            let folderName = FolderName(name)
            let! result = foldersService.RenameFolderLink(folderId, linkId, folderName, userId)
            match result with
            | Result.Error(fail) ->
                match fail with
                | RenameFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | RenameFail.Unauthorized(_) -> return (UnauthorizedResult() :> IActionResult)
            | Result.Ok(model) -> return (OkResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("rename_head_link")>]
    member this.RenameHeadLink([<FromQuery(Name = "folder_id")>] folderId: string,
                               [<FromQuery(Name = "link_id")>] linkId: string, [<FromQuery(Name = "name")>] name: string) =
        async {
            let userId = this.GetUserId()
            let folderId = FolderId(folderId)
            let linkId = HeadId(linkId)
            let headName = HeadName(name)
            let! result = foldersService.RenameHeadLink(folderId, linkId, headName, userId)
            match result with
            | Result.Error(fail) ->
                match fail with
                | RenameFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | RenameFail.Unauthorized(_) -> return (UnauthorizedResult() :> IActionResult
                )
            | Result.Ok(model) -> return (OkResult() :> IActionResult)
        }
        |> Async.StartAsTask
