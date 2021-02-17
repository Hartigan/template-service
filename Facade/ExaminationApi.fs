namespace Facade

open Microsoft.AspNetCore.Authorization
open GrpcExamination
open Models.Permissions
open Services.VersionControl
open Services.Examination
open Services.Permissions
open Microsoft.Extensions.Logging
open DatabaseTypes.Identificators
open Grpc.Core
open System.Security.Claims
open Domain
open Models.Problems
open Models.Permissions
open Models.Heads
open Utils.ResultHelper
open FSharp.Control

[<Authorize>]
type ExaminationApi(permissionsService: IPermissionsService,
                    versionControlService: IVersionControlService,
                    examinationService: IExaminationService,
                    logger: ILogger<ExaminationApi>) =
    inherit GrpcExamination.ExaminationService.ExaminationServiceBase()

    member private this.GetUserId(context: ServerCallContext) = UserId(context.GetHttpContext().User.FindFirst(ClaimTypes.NameIdentifier).Value)

    override this.GetSubmission(request, context) =
        async {
            let userId = this.GetUserId(context)
            let submissionId = SubmissionId(request.SubmissionId)
            match! permissionsService.CheckPermissions(ProtectedId.Submission(submissionId), userId, AccessModel.CanRead) with
            | Ok() ->
                match! examinationService.Get(submissionId) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot get submission")
                    let error = GetSubmissionReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- GetSubmissionReply.Types.Error.Types.Status.Unknown
                    let reply = GetSubmissionReply()
                    reply.Error <- error
                    return reply
                | Ok(model) ->
                    let reply = GetSubmissionReply()
                    reply.Submission <- Converter.Convert(model)
                    return reply
            | Error(ex) ->
                let error = GetSubmissionReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- GetSubmissionReply.Types.Error.Types.Status.NoAccess
                let reply = GetSubmissionReply()
                reply.Error <- error
                return reply
        }
        |> Async.StartAsTask

    override this.ApplyAnswer(request, context) =
        async {
            let userId = this.GetUserId(context)
            let submissionId = SubmissionId(request.SubmissionId)
            match! permissionsService.CheckPermissions(ProtectedId.Submission(submissionId), userId, AccessModel.CanWrite) with
            | Ok() ->
                let generatedProblemId = GeneratedProblemId(request.GeneratedProblemId)
                let answer = ProblemAnswer(request.Answer)
                match! examinationService.ApplyAnswer(generatedProblemId, answer, submissionId) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot apply answer")
                    let error = ApplyAnswerReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- ApplyAnswerReply.Types.Error.Types.Status.Unknown
                    let reply = ApplyAnswerReply()
                    reply.Error <- error
                    return reply
                | Ok(model) -> 
                    let reply = ApplyAnswerReply()
                    return reply
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                let error = ApplyAnswerReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- ApplyAnswerReply.Types.Error.Types.Status.NoAccess
                let reply = ApplyAnswerReply()
                reply.Error <- error
                return reply
        }
        |> Async.StartAsTask

    override this.CompleteSubmission(request, context) =
        async {
            let userId = this.GetUserId(context)
            let submissionId = SubmissionId(request.SubmissionId)
            match! permissionsService.CheckPermissions(ProtectedId.Submission(submissionId), userId, AccessModel.CanWrite) with
            | Ok() ->
                match! examinationService.Complete(submissionId, userId) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot complete")
                    let error = CompleteSubmissionReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- CompleteSubmissionReply.Types.Error.Types.Status.Unknown
                    let reply = CompleteSubmissionReply()
                    reply.Error <- error
                    return reply
                | Ok(model) -> 
                    let reply = CompleteSubmissionReply()
                    reply.ReportId <- model.Value
                    return reply
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                let error = CompleteSubmissionReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- CompleteSubmissionReply.Types.Error.Types.Status.NoAccess
                let reply = CompleteSubmissionReply()
                reply.Error <- error
                return reply
        }
        |> Async.StartAsTask

    override this.StartSubmission(request, context) =
        async {
            let userId = this.GetUserId(context)
            let headId = HeadId(request.ProblemSetHeadId)
            match! permissionsService.CheckPermissions(ProtectedId.Head(headId), userId, AccessModel.CanGenerate) with
            | Ok() ->
                match! versionControlService.Get(headId) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot get head for start")
                    let error = StartSubmissionReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- StartSubmissionReply.Types.Error.Types.Status.HeadNotFound
                    let reply = StartSubmissionReply()
                    reply.Error <- error
                    return reply
                | Ok(head) ->
                    match head.Commit.Target.ConcreteId with
                    | ConcreteId.ProblemSet(problemSetId) ->
                        match! examinationService.CreateSubmission(problemSetId, userId) with
                        | Error(ex) ->
                            logger.LogError(ex, "Cannot create submission")
                            let error = StartSubmissionReply.Types.Error()
                            error.Description <- ex.Message
                            error.Status <- StartSubmissionReply.Types.Error.Types.Status.CannotStartSubmission
                            let reply = StartSubmissionReply()
                            reply.Error <- error
                            return reply
                        | Ok(model) ->
                            let reply = StartSubmissionReply()
                            reply.SubmissionId <- model.Value
                            return reply
                    | _ ->
                        logger.LogError("Invalid type")
                        let error = StartSubmissionReply.Types.Error()
                        error.Description <- "Invalid type of head"
                        error.Status <- StartSubmissionReply.Types.Error.Types.Status.WrongHeadType
                        let reply = StartSubmissionReply()
                        reply.Error <- error
                        return reply
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                let error = StartSubmissionReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- StartSubmissionReply.Types.Error.Types.Status.NoAccess
                let reply = StartSubmissionReply()
                reply.Error <- error
                return reply
        }
        |> Async.StartAsTask

    override this.GetReport(request, context) =
        async {
            let userId = this.GetUserId(context)
            let reportId = ReportId(request.ReportId)
            match! permissionsService.CheckPermissions(ProtectedId.Report(reportId), userId, AccessModel.CanRead) with
            | Ok() ->
                match! examinationService.Get(reportId) with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot get report")
                    let error = GetReportReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- GetReportReply.Types.Error.Types.Status.Unknown
                    let reply = GetReportReply()
                    reply.Error <- error
                    return reply
                | Ok(model) ->
                    let reply = GetReportReply()
                    reply.Report <- Converter.Convert(model)
                    return reply
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                let error = GetReportReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- GetReportReply.Types.Error.Types.Status.NoAccess
                let reply = GetReportReply()
                reply.Error <- error
                return reply
        }
        |> Async.StartAsTask

    override this.GetSubmissions(request, context) =
        async {
            let userId = this.GetUserId(context)
            match! examinationService.GetSubmissions(userId) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get submissions")
                let error = GetSubmissionsReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- GetSubmissionsReply.Types.Error.Types.Status.Unknown
                let reply = GetSubmissionsReply()
                reply.Error <- error
                return reply
            | Ok(models) ->
                let submissions = GetSubmissionsReply.Types.Submissions()
                Converter.Convert(models, submissions.SubmissionIds, fun x -> x.Value)
                let reply = GetSubmissionsReply()
                reply.Submissions <- submissions
                return reply
        }
        |> Async.StartAsTask

    override this.GetReports(request, context) =
        async {
            let userId = this.GetUserId(context)
            let pattern =
                match request.Pattern with
                | null -> None
                | str -> Some(str)
            let authorId =
                match request.UserId with
                | null -> None
                | id -> Some(UserId(id))

            let date =
                match request.DateInterval with
                | null -> None
                | d -> Some(BackConverter.Convert(d))

            match! examinationService.Search(pattern, userId, authorId, date, request.Offset, request.Limit) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get reports by author")
                let error = GetReportsReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- GetReportsReply.Types.Error.Types.Status.Unknown
                let reply = GetReportsReply()
                reply.Error <- error
                return reply
            | Ok(models) ->
                let reportsList = GetReportsReply.Types.ReportsList()
                Converter.Convert(models, reportsList.Reports, Converter.Convert)
                let reply = GetReportsReply()
                reply.Reports <- reportsList
                return reply
        }
        |> Async.StartAsTask

    override this.ShareReport(request, context) =
        async {
            let userId = this.GetUserId(context)
            let reportId = ReportId(request.ReportId)
            match! permissionsService.CheckPermissions(ProtectedId.Report(reportId), userId, AccessModel.CanAdministrate) with
            | Ok() ->
                let! result =
                    request.UserIds
                    |> Seq.map(fun id -> permissionsService.Share(ProtectedId.Report(reportId), UserId(id)))
                    |> Seq.append(
                        request.GroupIds
                        |> Seq.map(fun id -> permissionsService.Share(ProtectedId.Report(reportId), GroupId(id)))
                    )
                    |> ResultOfAsyncSeq
                match result with
                | Error(ex) ->
                    logger.LogError(ex, "Cannot share report")
                    let error = ShareReportReply.Types.Error()
                    error.Description <- ex.Message
                    error.Status <- ShareReportReply.Types.Error.Types.Status.Unknown
                    let reply = ShareReportReply()
                    reply.Error <- error
                    return reply
                | Ok(model) ->
                    let reply = ShareReportReply()
                    return reply
            | Error(ex) ->
                logger.LogError(ex, "Access denied")
                let error = ShareReportReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- ShareReportReply.Types.Error.Types.Status.NoAccess
                let reply = ShareReportReply()
                reply.Error <- error
                return reply
        }
        |> Async.StartAsTask

    override this.GetProblemSets(request, context) =
        async {
            let userId = this.GetUserId(context)
            let pattern =
                match request.Pattern with
                | null -> None
                | p -> Some(p)
            let tags = List.ofSeq request.Tags |> List.map(fun x -> TagModel(x))
            let authorId =
                match request.AuthorId with
                | null -> None
                | id -> Some(UserId(id))
            let problemsCount =
                match request.ProblemsCount with
                | null -> None
                | interval -> Some(BackConverter.Convert(interval))
            let duration =
                match request.DurationS with
                | null -> None
                | interval -> Some(BackConverter.Convert(interval))
            match! examinationService.GetProblemSets(request.IsPublic,
                                                     userId,
                                                     pattern,
                                                     tags,
                                                     authorId,
                                                     problemsCount,
                                                     duration,
                                                     request.Offset,
                                                     request.Limit) with
            | Error(ex) ->
                logger.LogError(ex, "Cannot get problem sets")
                let error = GetProblemSetsReply.Types.Error()
                error.Description <- ex.Message
                error.Status <- GetProblemSetsReply.Types.Error.Types.Status.Unknown
                let reply = GetProblemSetsReply()
                reply.Error <- error
                return reply
            | Ok(models) ->
                let headList = GetProblemSetsReply.Types.HeadList()
                Converter.Convert(models, headList.Heads, Converter.Convert)
                let reply = GetProblemSetsReply()
                reply.Heads <- headList
                return reply
        }
        |> Async.StartAsTask

    override this.GetProblemSetsPreviews(request, context) =
        async {
            let userId = this.GetUserId(context)
            let reply = GetProblemSetsPreviewsReply()

            let! previews =
                request.CommitIds
                |> AsyncSeq.ofSeq
                |> AsyncSeq.mapAsyncParallel(fun id ->
                    async {
                        let commitId = CommitId(id)
                        let entry = GetProblemSetsPreviewsReply.Types.Entry()
                        entry.CommitId <- id
                        match! versionControlService.Get(commitId) with
                        | Error(ex) ->
                            logger.LogError(ex, "Cannot get commit for problem set preview")
                            entry.Status <- GetProblemSetsPreviewsReply.Types.Status.NotFound
                            return entry
                        | Ok(commit) ->
                            match! permissionsService.CheckPermissions(ProtectedId.Head(commit.HeadId), userId, AccessModel.CanGenerate) with
                            | Error(ex) ->
                                logger.LogError(ex, "Access denied")
                                entry.Status <- GetProblemSetsPreviewsReply.Types.Status.NoAccess
                                return entry
                            | Ok(_) ->
                                match! examinationService.GetProblemSetPreview(commitId) with
                                | Error(ex) ->
                                    logger.LogError(ex, "Cannot get problem set preview")
                                    entry.Status <- GetProblemSetsPreviewsReply.Types.Status.Unknown
                                    return entry
                                | Ok(model) ->
                                    entry.Preview <- Converter.Convert(model)
                                    entry.Status <- GetProblemSetsPreviewsReply.Types.Status.Ok
                                    return entry
                    }
                )
                |> AsyncSeq.toArrayAsync
            
            reply.Previews.AddRange(previews)
            return reply
        }
        |> Async.StartAsTask

    override this.GetSubmissionsPreviews(request, context) =
        async {
            let userId = this.GetUserId(context)

            let reply = GetSubmissionsPreviewsReply()

            let! previews =
                request.SubmissionIds
                |> AsyncSeq.ofSeq
                |> AsyncSeq.mapAsyncParallel(fun id ->
                    async {
                        let submissionId = SubmissionId(id)
                        let entry = GetSubmissionsPreviewsReply.Types.Entry()
                        match! permissionsService.CheckPermissions(ProtectedId.Submission(submissionId), userId, AccessModel.CanRead) with
                        | Error(ex) ->
                            logger.LogError(ex, "Access denied")
                            entry.Status <- GetSubmissionsPreviewsReply.Types.Status.NoAccess
                            return entry
                        | Ok(_) ->
                            match! examinationService.GetPreview(submissionId) with
                            | Error(ex) ->
                                logger.LogError(ex, "Cannot get submission preview")
                                entry.Status <- GetSubmissionsPreviewsReply.Types.Status.Unknown
                                return entry
                            | Ok(model) ->
                                entry.Preview <- Converter.Convert(model)
                                entry.Status <- GetSubmissionsPreviewsReply.Types.Status.Ok
                                return entry
                    }
                )
                |> AsyncSeq.toArrayAsync

            reply.Previews.AddRange(previews)
            return reply
        }
        |> Async.StartAsTask
