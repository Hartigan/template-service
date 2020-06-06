namespace Contexts

open DatabaseTypes
open Storage
open System
open System.Linq
open Couchbase
open Couchbase.Query
open Utils.AsyncHelper
open FSharp.Control
open DatabaseTypes.Identificators

type GroupContext(couchbaseBuckets: CouchbaseBuckets, couchbaseCluster: CouchbaseCluster) =
    let commonContext =  CommonContext<UserGroup>(couchbaseBuckets) :> IContext<UserGroup>

    member internal this.GetBucket() =
        async {
            let! (bucket: IBucket) = couchbaseBuckets.GetMainBucketAsync()
            return bucket
        }

    interface IGroupContext with
        member this.Exists(key) =
            commonContext.Exists(key)
        member this.Get(key) = 
            commonContext.Get(key)
        member this.Insert(key, entity) =
            commonContext.Insert(key, entity)
        member this.Remove(key) =
            commonContext.Remove(key)
        member this.Update(key: IDocumentKey, updater: UserGroup -> Result<UserGroup, Exception>) =
            commonContext.Update(key, updater)
        member this.Update(key: IDocumentKey, updater: UserGroup -> UserGroup) =
            commonContext.Update(key, updater)

        member this.Search(pattern, offset, limit) =
            async {
                try
                    let! (cluster : ICluster) = couchbaseCluster.GetClusterAsync()
                    let! bucket = this.GetBucket()
                    let queryOptions = 
                        QueryOptions()
                        |> fun x -> x.Parameter("type", UserGroupType.Instance.Value)
                        |> fun x -> x.Parameter("offset", offset)
                        |> fun x -> x.Parameter("limit", limit)
                        |> fun x ->
                            match pattern with
                            | None -> x
                            | Some(p) -> x.Parameter("pattern", p)

                    let patternFilter = 
                        match pattern with
                        | None -> String.Empty
                        | Some(_) -> "AND CONTAINS(LOWER(`name`), LOWER($pattern))"

                    let! result = cluster.QueryAsync<UserGroup>
                                      (sprintf "SELECT `%s`.* FROM `%s` WHERE type = $type %s OFFSET $offset LIMIT $limit" bucket.Name bucket.Name patternFilter,
                                       queryOptions)
                    let (groupsAsync : IQueryResult<UserGroup>) = result
                    let groups =
                        groupsAsync
                        |> AsyncSeq.ofAsyncEnum
                        |> AsyncSeq.toBlockingSeq
                    return Ok(groups |> List.ofSeq)
                with ex -> return Result.Error(ex)
            }

type HeadContext(couchbaseBuckets: CouchbaseBuckets, couchbaseCluster: CouchbaseCluster) =
    let commonContext =  CommonContext<Head>(couchbaseBuckets) :> IContext<Head>

    member internal this.GetBucket() =
        async {
            let! (bucket: IBucket) = couchbaseBuckets.GetMainBucketAsync()
            return bucket
        }

    interface IHeadContext with
        member this.Exists(key) =
            commonContext.Exists(key)
        member this.Get(key) = 
            commonContext.Get(key)
        member this.Insert(key, entity) =
            commonContext.Insert(key, entity)
        member this.Remove(key) =
            commonContext.Remove(key)
        member this.Update(key: IDocumentKey, updater: Head -> Result<Head, Exception>) =
            commonContext.Update(key, updater)
        member this.Update(key: IDocumentKey, updater: Head -> Head) =
            commonContext.Update(key, updater)

        member this.SearchProblemSets(pattern, tags, headIds, offset, limit) =
            async {
                try
                    let! (cluster : ICluster) = couchbaseCluster.GetClusterAsync()
                    let! bucket = this.GetBucket()
                    let queryOptions = 
                        QueryOptions()
                        |> fun x -> x.Parameter("type", HeadType.Instance.Value)
                        |> fun x ->
                            if tags.IsEmpty then
                                x
                            else
                                x.Parameter("tags", tags |> Seq.distinct |> Array.ofSeq)
                        |> fun x -> x.Parameter("ids", headIds |> Seq.map(fun id -> id.Value) |> Array.ofSeq)
                        |> fun x -> x.Parameter("offset", offset)
                        |> fun x -> x.Parameter("limit", limit)
                        |> fun x ->
                            match pattern with
                            | None -> x
                            | Some(p) -> x.Parameter("pattern", p)

                    let patternFilter =
                        match pattern with
                        | None -> String.Empty
                        | Some(_) -> "AND CONTAINS(LOWER(p.title), LOWER($pattern))"

                    let tagsFilter =
                        if tags.IsEmpty then
                            String.Empty
                        else
                            "AND ARRAY_SORT(ARRAY_INTERSECT(h.tags, $tags)) = ARRAY_SORT($tags)"

                    let! result = cluster.QueryAsync<Head>
                                      (sprintf "
SELECT RAW h FROM `%s` h
INNER JOIN `%s` p
ON
h.`commit`.target.id = p.id
WHERE
h.type = $head_type
AND h.`commit`.target.type = $problem_set_type
AND p.type = $problem_set_type
AND ARRAY_CONTAINS($ids, h.id)
%s
%s
OFFSET $offset
LIMIT $limit
" bucket.Name bucket.Name tagsFilter patternFilter,
                                       queryOptions)
                    let (headsAsync : IQueryResult<Head>) = result
                    let heads =
                        headsAsync
                        |> AsyncSeq.ofAsyncEnum
                        |> AsyncSeq.toBlockingSeq
                    return Ok(heads |> List.ofSeq)
                with ex -> return Result.Error(ex)
            }

type ReportContext(couchbaseBuckets: CouchbaseBuckets, couchbaseCluster: CouchbaseCluster) =
    let commonContext =  CommonContext<Report>(couchbaseBuckets) :> IContext<Report>

    member internal this.GetBucket() =
        async {
            let! (bucket: IBucket) = couchbaseBuckets.GetMainBucketAsync()
            return bucket
        }

    interface IReportContext with
        member this.Exists(key) =
            commonContext.Exists(key)
        member this.Get(key) = 
            commonContext.Get(key)
        member this.Insert(key, entity) =
            commonContext.Insert(key, entity)
        member this.Remove(key) =
            commonContext.Remove(key)
        member this.Update(key: IDocumentKey, updater: Report -> Result<Report, Exception>) =
            commonContext.Update(key, updater)
        member this.Update(key: IDocumentKey, updater: Report -> Report) =
            commonContext.Update(key, updater)

        member this.Search(pattern, userId, reportIds, offset, limit) =
            async {
                try
                    let! (cluster : ICluster) = couchbaseCluster.GetClusterAsync()
                    let! bucket = this.GetBucket()
                    let queryOptions = 
                        QueryOptions()
                        |> fun x -> x.Parameter("report_type", ReportType.Instance.Value)
                        |> fun x -> x.Parameter("generated_problem_set_type", GeneratedProblemSetType.Instance.Value)
                        |> fun x ->
                            match userId with
                            | None -> x
                            | Some(u) -> x.Parameter("userId", u.Value)
                        |> fun x -> x.Parameter("ids", reportIds |> Seq.map(fun id -> id.Value) |> Array.ofSeq)
                        |> fun x -> x.Parameter("offset", offset)
                        |> fun x -> x.Parameter("limit", limit)
                        |> fun x ->
                            match pattern with
                            | None -> x
                            | Some(p) -> x.Parameter("pattern", p)

                    let patternFilter =
                        match pattern with
                        | None -> String.Empty
                        | Some(_) -> "AND CONTAINS(LOWER(g.title), LOWER($pattern))"

                    let userFilter =
                        match userId with
                        | None -> String.Empty
                        | Some(_) -> "AND r.permissions.owner_id = $userId"

                    let! result = cluster.QueryAsync<Report>
                                      (sprintf "
SELECT RAW r FROM `%s` r
INNER JOIN `%s` g
ON
r.generated_problem_set_id = g.id
WHERE
r.type = $report_type
AND g.type = $generated_problem_set_type
AND ARRAY_CONTAINS($ids, r.id)
%s
%s
OFFSET $offset
LIMIT $limit
" bucket.Name bucket.Name patternFilter userFilter, queryOptions)
                    let (reportsAsync : IQueryResult<Report>) = result
                    let reports =
                        reportsAsync
                        |> AsyncSeq.ofAsyncEnum
                        |> AsyncSeq.toBlockingSeq
                    return Ok(reports |> List.ofSeq)
                with ex -> return Result.Error(ex)
            }

type SubmissionContext = CommonContext<Submission>

type GeneratedProblemSetContext = CommonContext<GeneratedProblemSet>

type GeneratedProblemContext = CommonContext<GeneratedProblem>

type CommitContext = CommonContext<Commit>

type FolderContext = CommonContext<Folder>

type ProblemContext = CommonContext<Problem>

type ProblemSetContext = CommonContext<ProblemSet>

type GroupItemsContext = CommonContext<GroupItems>

type TrashContext(couchbaseBuckets: CouchbaseBuckets) =
    let commonContext = CommonContext<Trash>(couchbaseBuckets) :> IContext<Trash>

    interface IContext<Trash> with
        member this.Exists(key) =
            commonContext.Exists(key)
        member this.Get(key) = 
            commonContext.Get(key)
        member this.Insert(key, entity) =
            commonContext.Insert(key, entity)
        member this.Remove(key) =
            commonContext.Remove(key)
        member this.Update(key: IDocumentKey, updater: Trash -> Result<Trash, Exception>) =
            commonContext.Update(key, updater)
        member this.Update(key: IDocumentKey, updater: Trash -> Trash) =
            commonContext.Update(key, updater)

type UserGroupsContext(couchbaseBuckets: CouchbaseBuckets) =
    let commonContext = CommonContext<UserGroups>(couchbaseBuckets) :> IContext<UserGroups>

    interface IContext<UserGroups> with
        member this.Exists(key) =
            commonContext.Exists(key)
        member this.Get(key) = 
            commonContext.Get(key)
        member this.Insert(key, entity) =
            commonContext.Insert(key, entity)
        member this.Remove(key) =
            commonContext.Remove(key)
        member this.Update(key: IDocumentKey, updater: UserGroups -> Result<UserGroups, Exception>) =
            commonContext.Update(key, updater)
        member this.Update(key: IDocumentKey, updater: UserGroups -> UserGroups) =
            commonContext.Update(key, updater)

type UserItemsContext(couchbaseBuckets: CouchbaseBuckets) =
    let commonContext = CommonContext<UserItems>(couchbaseBuckets) :> IContext<UserItems>

    interface IContext<UserItems> with
        member this.Exists(key) =
            commonContext.Exists(key)
        member this.Get(key) = 
            commonContext.Get(key)
        member this.Insert(key, entity) =
            commonContext.Insert(key, entity)
        member this.Remove(key) =
            commonContext.Remove(key)
        member this.Update(key: IDocumentKey, updater: UserItems -> Result<UserItems, Exception>) =
            commonContext.Update(key, updater)
        member this.Update(key: IDocumentKey, updater: UserItems -> UserItems) =
            commonContext.Update(key, updater)


type UserContext(couchbaseBuckets: CouchbaseBuckets, couchbaseCluster: CouchbaseCluster) =
    let commonContext = CommonContext<User>(couchbaseBuckets) :> IContext<User>
    let normalizedName = "normalized_name"

    member internal this.GetBucket() =
        async {
            let! (bucket: IBucket) = couchbaseBuckets.GetMainBucketAsync()
            return bucket
        }

    interface IUserContext with
        member this.Exists(key) =
            commonContext.Exists(key)
        member this.Get(key) = 
            commonContext.Get(key)
        member this.Insert(key, entity) =
            commonContext.Insert(key, entity)
        member this.Remove(key) =
            commonContext.Remove(key)
        member this.Update(key: IDocumentKey, updater: User -> Result<User, Exception>) =
            commonContext.Update(key, updater)
        member this.Update(key: IDocumentKey, updater: User -> User) =
            commonContext.Update(key, updater)
        
        member this.GetByName(name: string): Async<Result<User, Exception>> =
            async {
                try
                    let! (cluster : ICluster) = couchbaseCluster.GetClusterAsync()
                    let! bucket = this.GetBucket()
                    let queryOptions = 
                        QueryOptions()
                        |> fun x -> x.Parameter("type", UserType.Instance.Value)
                        |> fun x -> x.Parameter("normalized_name", name)
                    let! result = cluster.QueryAsync<User>
                                      (sprintf "SELECT `%s`.* FROM `%s` WHERE type = $type AND `%s` = $normalized_name LIMIT 1" bucket.Name bucket.Name normalizedName,
                                       queryOptions)
                    let (usersAsync : IQueryResult<User>) = result
                    let! user =
                        usersAsync
                        |> AsyncSeq.ofAsyncEnum
                        |> AsyncSeq.tryFirst
                    match user with
                    | None ->
                        return Result.Error(InvalidOperationException("User not found") :> Exception)
                    | Some(u) ->
                        return Ok(u)
                with ex -> return Result.Error(ex)
            }

        member this.Search(pattern, offset, limit): Async<Result<List<User>, Exception>> =
            async {
                try
                    let! (cluster : ICluster) = couchbaseCluster.GetClusterAsync()
                    let! bucket = this.GetBucket()
                    let queryOptions = 
                        QueryOptions()
                        |> fun x -> x.Parameter("type", UserType.Instance.Value)
                        |> fun x -> x.Parameter("offset", offset)
                        |> fun x -> x.Parameter("limit", limit)
                        |> fun x ->
                            match pattern with
                            | None -> x
                            | Some(p) ->  x.Parameter("pattern", p)

                    let patternFilter =
                        match pattern with
                        | None -> String.Empty
                        | Some(_) -> sprintf "AND CONTAINS(LOWER(`%s`), LOWER($pattern))" normalizedName
                    let! result = cluster.QueryAsync<User>
                                      (sprintf "SELECT `%s`.* FROM `%s` WHERE type = $type %s LIMIT $limit OFFSET $offset" bucket.Name bucket.Name patternFilter,
                                       queryOptions)
                    let (usersAsync : IQueryResult<User>) = result
                    let users =
                        usersAsync
                        |> AsyncSeq.ofAsyncEnum
                        |> AsyncSeq.toBlockingSeq
                    return Ok(users |> List.ofSeq)
                with ex -> return Result.Error(ex)
            }

type UserRoleContext(couchbaseBuckets: CouchbaseBuckets, couchbaseCluster: CouchbaseCluster) =
    let commonContext = CommonContext<UserRole>(couchbaseBuckets) :> IContext<UserRole>
    let nameProperty = "name"

    member internal this.GetBucket() =
        async {
            let! (bucket: IBucket) = couchbaseBuckets.GetMainBucketAsync()
            return bucket
        }

    interface IUserRoleContext with

        member this.Exists(key) =
            commonContext.Exists(key)
        member this.Get(key) = 
            commonContext.Get(key)
        member this.Insert(key, entity) =
            commonContext.Insert(key, entity)
        member this.Remove(key) =
            commonContext.Remove(key)
        member this.Update(key: IDocumentKey, updater: UserRole -> Result<UserRole, Exception>) =
            commonContext.Update(key, updater)
        member this.Update(key: IDocumentKey, updater: UserRole -> UserRole) =
            commonContext.Update(key, updater)

        member this.GetByName(name) =
            async {
                try
                    let! (cluster : ICluster) = couchbaseCluster.GetClusterAsync()
                    let! bucket = this.GetBucket()
                    let queryOptions = 
                        QueryOptions()
                        |> fun x -> x.Parameter("type", UserRoleType.Instance.Value)
                        |> fun x -> x.Parameter("bucket", bucket.Name)
                        |> fun x -> x.Parameter("name_property", nameProperty)
                        |> fun x -> x.Parameter("name", name)
                    let! result = cluster.QueryAsync<UserRole>
                                      ("SELECT * as user_role FROM $bucket WHERE type = $type and $name_property = $name LIMIT 1",
                                       queryOptions)
                    let rolesAsync = (result : IQueryResult<UserRole>)
                    let! role =
                        rolesAsync
                        |> AsyncSeq.ofAsyncEnum
                        |> AsyncSeq.tryFirst
                    match role with
                    | Some(r) ->
                        return Ok(r)
                    | None ->
                        return Result.Error(InvalidOperationException(sprintf "User role %s not found" name) :> Exception)
                with ex -> return Result.Error(ex)
            }