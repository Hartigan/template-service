namespace Contexts

open DatabaseTypes
open DatabaseTypes.Identificators
open FSharp.Control
open Microsoft.FSharp.Control
open Utils.ResultHelper
open Microsoft.Extensions.Logging
open System

type HeadSearch(headContext: IHeadContext,
                problemSetContext: IContext<ProblemSet>,
                logger: ILogger<HeadSearch>) =

    member this.HeadFilter(tags: List<string>) : AsyncSeq<Head> -> AsyncSeq<Head> =
        if tags.IsEmpty then
            id
        else
            let setOfTags = Set.ofList(tags)
            AsyncSeq.filter(fun head ->
                head.Tags
                |> Set.ofList
                |> setOfTags.IsSubsetOf
            )

    member this.SkipFailed() : AsyncSeq<Result<Head, Exception>> -> AsyncSeq<Head> =
        AsyncSeq.collect(fun r ->
            match r with
            | Result.Error(ex) ->
                logger.LogWarning(ex, "Head search fail")
                AsyncSeq.empty
            | Ok(head) ->
                AsyncSeq.singleton(head)
        )

    interface IHeadSearch with
        member this.Search(patternOpt, ownerOpt, tags, headIds, offset, limit) = 
            headIds
            |> AsyncSeq.ofSeq
            |> AsyncSeq.mapAsync (Head.CreateDocumentKey >> headContext.Get)
            |> this.SkipFailed()
            |> fun x ->
                match patternOpt with
                | None -> x
                | Some(p) ->
                    let normalizedPattern = p.ToLower()
                    x
                    |> AsyncSeq.filter(fun head -> head.Name.ToLower().Contains(normalizedPattern))
            |> fun x ->
                match ownerOpt with
                | None -> x
                | Some(ownerId) ->
                    x
                    |> AsyncSeq.filter(fun head -> head.Permissions.OwnerId = ownerId)
            |> this.HeadFilter tags
            |> AsyncSeq.skip(int offset)
            |> AsyncSeq.take(int limit)
            |> AsyncSeq.toListAsync

        member this.SearchProblemSets(pattern, tags, headIds, offset, limit) =
            headIds
            |> AsyncSeq.ofSeq
            |> AsyncSeq.mapAsync (Head.CreateDocumentKey >> headContext.Get)
            |> this.SkipFailed()
            |> fun x ->
                match pattern with
                | None -> x
                | Some(p) ->
                    let normalizedPattern = p.ToLower()
                    x
                    |> AsyncSeq.filterAsync(fun head ->
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
            |> this.HeadFilter tags
            |> AsyncSeq.skip(int offset)
            |> AsyncSeq.take(int limit)
            |> AsyncSeq.toListAsync


type ReportSearch(reportContext: IReportContext,
                  generatedProblemSetContext: IContext<GeneratedProblemSet>,
                  logger: ILogger<ReportSearch>
                  ) =

    member this.SkipFailed() : AsyncSeq<Result<Report, Exception>> -> AsyncSeq<Report> =
        AsyncSeq.collect(fun r ->
            match r with
            | Result.Error(ex) ->
                logger.LogWarning(ex, "Report search fail")
                AsyncSeq.empty
            | Ok(head) ->
                AsyncSeq.singleton(head)
        )

    interface IReportSearch with
        member this.Search(pattern, userId, reportIds, offset, limit) =
            reportIds
            |> AsyncSeq.ofSeq
            |> AsyncSeq.mapAsync (Report.CreateDocumentKey >> reportContext.Get)
            |> this.SkipFailed()
            |> fun x ->
                match pattern with
                | None -> x
                | Some(p) ->
                    let normalizedPattern = p.ToLower()
                    x
                    |> AsyncSeq.filterAsync(fun report ->
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
                    |> AsyncSeq.filter(fun report ->
                        report.Permissions.OwnerId = ownerId
                    )
            |> AsyncSeq.skip(int offset)
            |> AsyncSeq.take(int limit)
            |> AsyncSeq.toListAsync