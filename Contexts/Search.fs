namespace Contexts

open DatabaseTypes
open DatabaseTypes.Identificators
open FSharp.Control
open Microsoft.FSharp.Control
open Utils.ResultHelper
open Microsoft.Extensions.Logging

type HeadSearch(headContext: IHeadContext,
                problemSetContext: IContext<ProblemSet>,
                logger: ILogger<HeadSearch>) =

    interface IHeadSearch with
        member this.SearchProblemSets(pattern, tags, headIds, offset, limit) =
            headIds
            |> AsyncSeq.ofSeq
            |> AsyncSeq.mapAsync (Head.CreateDocumentKey >> headContext.Get)
            |> fun x ->
                match pattern with
                | None -> x
                | Some(p) ->
                    let normalizedPattern = p.ToLower()
                    x
                    |> AsyncSeq.filterAsync(fun r ->
                        match r with
                        | Result.Error(ex) ->
                            logger.LogWarning(ex, "Problem set search fail")
                            async.Return(false)
                        | Ok(head) ->
                            problemSetContext.Get(ProblemSet.CreateDocumentKey(ProblemSetId(head.Commit.Target.Id.Value)))
                            |> Async.MapResult(fun problemSet ->
                                problemSet.Title.ToLower().Contains(normalizedPattern)
                            )
                            |> Async.Map(fun result ->
                                match result with
                                | Result.Error(ex) ->
                                    logger.LogWarning(ex, "Cannot get Problem set")
                                    false
                                | Ok(filterResult) -> filterResult
                            )
                    )
            |> fun x ->
                if tags.IsEmpty then
                    x
                else
                    let setOfTags = Set.ofList(tags)
                    x
                    |> AsyncSeq.filter(fun r ->
                        match r with
                        | Result.Error(ex) ->
                            logger.LogWarning(ex, "Problem set search fail")
                            false
                        | Ok(head) ->
                            head.Tags
                            |> Set.ofList
                            |> setOfTags.IsSubsetOf
                    )
            |> AsyncSeq.skip(int offset)
            |> AsyncSeq.take(int limit)
            |> AsyncSeq.toListAsync
            |> Async.Map ResultOfSeq


type ReportSearch(reportContext: IReportContext,
                  generatedProblemSetContext: IContext<GeneratedProblemSet>,
                  logger: ILogger<ReportSearch>
                  ) =

    interface IReportSearch with
        member this.Search(pattern, userId, reportIds, offset, limit) =
            reportIds
            |> AsyncSeq.ofSeq
            |> AsyncSeq.mapAsync (Report.CreateDocumentKey >> reportContext.Get)
            |> fun x ->
                match pattern with
                | None -> x
                | Some(p) ->
                    let normalizedPattern = p.ToLower()
                    x
                    |> AsyncSeq.filterAsync(fun r ->
                        match r with
                        | Result.Error(ex) ->
                            logger.LogWarning(ex, "Report search fail")
                            async.Return(false)
                        | Ok(report) ->
                            generatedProblemSetContext.Get(GeneratedProblemSet.CreateDocumentKey(report.GeneratedProblemSetId))
                            |> Async.MapResult(fun generatedProblemSet ->
                                generatedProblemSet.Title.ToLower().Contains(normalizedPattern)
                            )
                            |> Async.Map(fun result ->
                                match result with
                                | Result.Error(ex) ->
                                    logger.LogWarning(ex, "Cannot get Generated problem set")
                                    false
                                | Ok(filterResult) -> filterResult
                            )
                    )
            |> fun x ->
                match userId with
                | None -> x
                | Some(ownerId) ->
                    x
                    |> AsyncSeq.filter(fun r ->
                        match r with
                        | Result.Error(ex) ->
                            logger.LogWarning(ex, "Report search fail")
                            false
                        | Ok(report) ->
                            report.Permissions.OwnerId = ownerId
                    )
            |> AsyncSeq.skip(int offset)
            |> AsyncSeq.take(int limit)
            |> AsyncSeq.toListAsync
            |> Async.Map ResultOfSeq