namespace WebApi

open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Authorization
open Services.Folders
open Services.Permissions
open Models.Identificators
open Models.Heads
open System.Security.Claims
open Services.VersionControl
open Services.Problems
open Models.Problems
open Microsoft.AspNetCore.Http
open System.Runtime.Serialization

[<DataContract>]
type CreateProblemSetRequest = {
    [<field: DataMember(Name = "folder_id")>]
    Folder: FolderId
    [<field: DataMember(Name = "name")>]
    Name: HeadName
    [<field: DataMember(Name = "problem_set")>]
    ProblemSet : ProblemSetModel
}

[<DataContract>]
type UpdateProblemSetRequest = {
    [<field: DataMember(Name = "head_id")>]
    Head: HeadId
    [<field: DataMember(Name = "description")>]
    Description: CommitDescription
    [<field: DataMember(Name = "problem_set")>]
    ProblemSet : ProblemSetModel
}

[<Authorize>]
[<Route("problem_set")>]
type ProblemSetController(foldersService: IFoldersService, permissionsService: IPermissionsService, versionControlService: IVersionControlService, problemsService: IProblemsService) =
    inherit ControllerBase()

    member private this.GetUserId() = UserId(this.User.FindFirst(ClaimTypes.NameIdentifier).Value)

    [<HttpGet>]
    [<Route("model")>]
    member this.GetModel([<FromQuery(Name = "commit_id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let commitId = CommitId(id)
            match! permissionsService.CheckPermissions(commitId, userId) with
            | Ok() ->
                match! versionControlService.Get(commitId) with
                | Result.Error(fail) ->
                    match fail with
                    | Services.VersionControl.GetFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Result.Ok(commit) ->
                    match commit.Target.ConcreteId with
                    | ProblemSet(problemSetId) ->
                        match! problemsService.Get(problemSetId) with
                        | Ok(model) -> return (JsonResult(model) :> IActionResult)
                        | _ -> return (StatusCodeResult(StatusCodes.Status500InternalServerError) :> IActionResult)
                    | _ -> return (StatusCodeResult(StatusCodes.Status500InternalServerError) :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("create")>]
    member this.CreateProblem([<FromBody>] req: CreateProblemSetRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(req.Folder, userId) with
            | Ok() ->
                match! problemsService.Create(req.ProblemSet) with
                | Result.Error(fail) ->
                    match fail with
                    | CreateFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Ok(problemSetId) ->
                    match! versionControlService.Create(req.Name, ConcreteId.ProblemSet(problemSetId), CommitDescription("Initial commit"), userId) with
                    | Result.Error(fail) ->
                        match fail with
                        | Services.VersionControl.CreateFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                    | Result.Ok(headId) ->
                        match! foldersService.AddHead(headId, req.Folder) with
                        | Result.Error(fail) ->
                            match fail with
                            | AddFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                        | Ok() -> return (JsonResult(Id(headId)) :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("update")>]
    member this.UpdateProblem([<FromBody>] req: UpdateProblemSetRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(req.Head, userId) with
            | Ok() ->
                match! problemsService.Create(req.ProblemSet) with
                | Result.Error(fail) ->
                    match fail with
                    | CreateFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Ok(problemSetId) ->
                    match! versionControlService.Create(ConcreteId.ProblemSet(problemSetId), req.Description, userId, req.Head) with
                    | Result.Error(fail) ->
                        match fail with
                        | Services.VersionControl.CreateFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                    | Result.Ok(commitId) -> return (JsonResult(Id(commitId)) :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask
