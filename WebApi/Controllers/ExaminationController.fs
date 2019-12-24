namespace WebApi

open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Authorization
open Services.Permissions
open Models.Identificators
open System.Security.Claims
open Services.Examination
open Services.Problems
open Services.VersionControl
open Models.Heads
open Models.Identificators
open Models.Reports
open System.Runtime.Serialization

type ApplyAnswerRequest = {
    [<field: DataMember(Name = "id")>]
    Id: SubmissionId
    [<field: DataMember(Name = "problem_answer")>]
    ProblemAnswer: ProblemAnswerModel
}

[<Authorize>]
[<Route("examination")>]
type ExaminationController(permissionsService: IPermissionsService,
                           versionControlService: IVersionControlService,
                           problemsService: IProblemsService,
                           examinationService: IExaminationService) =
    inherit ControllerBase()

    member private this.GetUserId() = UserId(this.User.FindFirst(ClaimTypes.NameIdentifier).Value)

    [<HttpGet>]
    [<Route("submission")>]
    member this.GetSubmission([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let submissionId = SubmissionId(id)
            match! permissionsService.CheckPermissions(submissionId, userId) with
            | Ok() ->
                match! examinationService.Get(submissionId) with
                | Result.Error(fail) ->
                    match fail with
                    | Services.Examination.GetFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Result.Ok(model) -> return (JsonResult(model) :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("answer")>]
    member this.ApplyAnswer([<FromBody>] req: ApplyAnswerRequest) =
        async {
            let userId = this.GetUserId()
            match! permissionsService.CheckPermissions(req.Id, userId) with
            | Ok() ->
                match! examinationService.ApplyAnswer(req.ProblemAnswer, req.Id) with
                | Result.Error(fail) ->
                    match fail with
                    | ApplyAnswerFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                    | ApplyAnswerFail.SubmissionAlreadyCompleted() -> return (BadRequestResult() :> IActionResult)
                    | ApplyAnswerFail.OutOfTime() -> return (BadRequestResult() :> IActionResult)
                | Result.Ok(model) -> return (JsonResult(model) :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("complete")>]
    member this.Complete([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let submissionId = SubmissionId(id)
            match! permissionsService.CheckPermissions(submissionId, userId) with
            | Ok() ->
                match! examinationService.Complete(submissionId) with
                | Result.Error(fail) ->
                    match fail with
                    | CompleteSubmissionFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Result.Ok(model) -> return (JsonResult(Id(model)) :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("start")>]
    member this.Start([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let headId = HeadId(id)
            match! permissionsService.CheckPermissions(headId, userId) with
            | Ok() ->
                match! versionControlService.Get(headId) with
                | Result.Error(fail) ->
                    match fail with
                    | Services.VersionControl.GetFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Ok(head) ->
                    match head.Commit.Target.ConcreteId with
                    | ConcreteId.ProblemSet(problemSetId) ->
                        match! examinationService.CreateSubmission(problemSetId, userId) with
                        | Result.Error(fail) ->
                            match fail with
                            | CreateSubmissionFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                        | Result.Ok(model) -> return (JsonResult(Id(model)) :> IActionResult)
                    | _ ->  return (BadRequestResult() :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("report")>]
    member this.GetReport([<FromQuery(Name = "id")>] id: string) =
        async {
            let userId = this.GetUserId()
            let reportId = ReportId(id)
            match! permissionsService.CheckPermissions(reportId, userId) with
            | Ok() ->
                match! examinationService.Get(reportId) with
                | Result.Error(fail) ->
                    match fail with
                    | Services.Examination.GetFail.Error(error) -> return (BadRequestResult() :> IActionResult)
                | Result.Ok(model) -> return (JsonResult(model) :> IActionResult)
            | _ -> return (UnauthorizedResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("submissions")>]
    member this.GetSubmissions() =
        async {
            let userId = this.GetUserId()
            match! examinationService.GetSubmissions(userId) with
            | Result.Error(fail) ->
                match fail with
                | Services.Examination.GetFail.Error(error) -> return (BadRequestResult() :> IActionResult)
            | Result.Ok(models) -> return (JsonResult(models) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpGet>]
    [<Route("reports")>]
    member this.GetReports() =
        async {
            let userId = this.GetUserId()
            match! examinationService.GetReports(userId) with
            | Result.Error(fail) ->
                match fail with
                | Services.Examination.GetFail.Error(error) -> return (BadRequestResult() :> IActionResult)
            | Result.Ok(models) -> return (JsonResult(models) :> IActionResult)
        }
        |> Async.StartAsTask
