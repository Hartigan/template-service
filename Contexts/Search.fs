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

    member this.FilterByTitle(patternOpt: string option, problemSet: ProblemSet) =
        match patternOpt with
        | None -> true
        | Some(pattern) -> problemSet.Title.ToLower().Contains(pattern)

    member this.FilterByProblemsCount(problemsCountOpt: SearchInterval<uint32> option, problemSet: ProblemSet) =
        match problemsCountOpt with
        | None -> true
        | Some(interval) -> 
            let length = uint32 problemSet.Slots.Length
            length >= interval.From && length <= interval.To

    member this.FilterByDuration(durationOpt: SearchInterval<int32> option, problemSet: ProblemSet) =
        match durationOpt with
        | None -> true
        | Some(interval) -> 
            let duration = problemSet.Duration
            duration >= interval.From && duration <= interval.To

    member this.HeadFilterByAuthor(authorIdOpt: UserId option) : AsyncSeq<Head> -> AsyncSeq<Head> =
        match authorIdOpt with
        | None -> id
        | Some(authorId) ->
            AsyncSeq.filter(fun head -> head.Permissions.OwnerId = authorId)

    interface IHeadSearch with
        member this.SearchPublicProblemSets(pattern, tags, ownerId, problemsCount, duration, offset, limit): Async<List<Head>> = 
            headContext.SearchPublicProblemSets(pattern,
                                                tags,
                                                ownerId,
                                                problemsCount |> Option.map(fun x -> { From = x.From; To = x.To }),
                                                duration |> Option.map(fun x -> { From = x.From; To = x.To }),
                                                offset,
                                                limit)
            |> Async.Map(fun r ->
                match r with
                | Ok(heads) -> heads
                | Error(ex) ->
                    logger.LogError(ex, "Cannot fetch heads with public problem sets")
                    []
            )

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

        member this.SearchPrivateProblemSets(pattern, tags, authorId, problemsCount, duration, headIds, offset, limit) =
            headIds
            |> AsyncSeq.ofSeq
            |> AsyncSeq.mapAsync (Head.CreateDocumentKey >> headContext.Get)
            |> this.SkipFailed()
            |> this.HeadFilterByAuthor authorId
            |> this.HeadFilter tags
            |> fun x ->
                match (pattern, authorId, problemsCount, duration) with
                | (None, None, None, None) -> x
                | _ ->
                    let normalizedPattern = pattern |> Option.map(fun p -> p.ToLower())
                    x
                    |> AsyncSeq.filterAsync(fun head ->
                        problemSetContext.Get(ProblemSet.CreateDocumentKey(ProblemSetId(head.Commit.Target.Id.Value)))
                        |> Async.MapResult(fun problemSet ->
                            this.FilterByDuration(duration, problemSet) &&
                            this.FilterByProblemsCount(problemsCount, problemSet) &&
                            this.FilterByTitle(normalizedPattern, problemSet)
                        )
                        |> Async.Map(fun result ->
                            match result with
                            | Result.Error(ex) ->
                                logger.LogWarning(ex, "Cannot get Problem set")
                                false
                            | Ok(filterResult) -> filterResult
                        )
                    )
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

    member this.SearchByUser(userOpt: UserId option) : AsyncSeq<Report> -> AsyncSeq<Report> =
        match userOpt with
        | None -> id
        | Some(ownerId) ->
            AsyncSeq.filter(fun report ->
                report.Permissions.OwnerId = ownerId
            )
    
    member this.SearchByDate(dateOpt: SearchInterval<DateTimeOffset> option) : AsyncSeq<Report> -> AsyncSeq<Report> =
        match dateOpt with
        | None -> id
        | Some(interval) ->
            AsyncSeq.filter(fun report ->
                interval.From.Date <= report.FinishedAt.Date && report.FinishedAt.Date <= interval.To.Date
            )

    member this.TitleFilter(patternOpt: string option) : GeneratedProblemSet -> Boolean =
        match patternOpt with
        | None -> fun _ -> true
        | Some(pattern) ->
            let normalized = pattern.ToLower()
            fun generatedProblemSet -> generatedProblemSet.Title.ToLower().Contains(normalized)

    interface IReportSearch with
        member this.Search(pattern, userOpt, dateOpt, reportIds, offset, limit) =
            reportIds
            |> AsyncSeq.ofSeq
            |> AsyncSeq.mapAsync (Report.CreateDocumentKey >> reportContext.Get)
            |> this.SkipFailed()
            |> this.SearchByDate(dateOpt)
            |> this.SearchByUser(userOpt)
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
            |> AsyncSeq.toListAsync
            |> Async.Map(fun x ->
                x
                |> List.sortByDescending(fun report -> report.FinishedAt)
                |> List.skip(int offset)
                |> List.take(int limit)
            )