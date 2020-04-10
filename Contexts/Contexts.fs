namespace Contexts

open DatabaseTypes
open Storage
open System
open System.Linq
open Couchbase
open Couchbase.Query
open Utils.AsyncHelper
open FSharp.Control

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
        member this.Update(key: IDocumentKey, updater: UserGroup -> Result<UserGroup,'TFail>) =
            commonContext.Update(key, updater)
        member this.Update(key: IDocumentKey, updater: UserGroup -> UserGroup) =
            commonContext.Update(key, updater)

        member this.GetByUser(userId) =
            async {
                try
                    let! (cluster : ICluster) = couchbaseCluster.GetClusterAsync()
                    let! bucket = this.GetBucket()
                    let queryOptions = 
                        QueryOptions()
                        |> fun x -> x.Parameter("type", UserGroup.TypeName)
                        |> fun x -> x.Parameter("owner_id", userId)
                    let! result = cluster.QueryAsync<UserGroup>
                                      (sprintf "SELECT `%s`.* FROM `%s` WHERE type = $type AND owner_id = $owner_id" bucket.Name bucket.Name,
                                       queryOptions)
                    let (groupsAsync : IQueryResult<UserGroup>) = result
                    let groups =
                        groupsAsync
                        |> AsyncSeq.ofAsyncEnum
                        |> AsyncSeq.toBlockingSeq
                    return Result.Ok(groups |> Seq.toList)
                with ex -> return Result.Error(GetDocumentFail.Error(ex))
            }

        member this.SearchByContainsInName(pattern) =
            async {
                try
                    let! (cluster : ICluster) = couchbaseCluster.GetClusterAsync()
                    let! bucket = this.GetBucket()
                    let queryOptions = 
                        QueryOptions()
                        |> fun x -> x.Parameter("type", UserGroup.TypeName)
                        |> fun x -> x.Parameter("pattern", pattern.ToUpper())
                    let! result = cluster.QueryAsync<UserGroup>
                                      (sprintf "SELECT `%s`.* FROM `%s` WHERE type = $type AND CONTAINS(UPPER(`name`), $pattern)" bucket.Name bucket.Name,
                                       queryOptions)
                    let (groupsAsync : IQueryResult<UserGroup>) = result
                    let groups =
                        groupsAsync
                        |> AsyncSeq.ofAsyncEnum
                        |> AsyncSeq.toBlockingSeq
                    return Result.Ok(groups |> List.ofSeq)
                with ex -> return Result.Error(GetDocumentFail.Error(ex))
            }

type SubmissionContext(couchbaseBuckets: CouchbaseBuckets, couchbaseCluster: CouchbaseCluster) =
    let commonContext =  CommonContext<Submission>(couchbaseBuckets) :> IContext<Submission>

    member internal this.GetBucket() =
        async {
            let! (bucket: IBucket) = couchbaseBuckets.GetMainBucketAsync()
            return bucket
        }

    interface ISubmissionContext with
        member this.Exists(key) =
            commonContext.Exists(key)
        member this.Get(key) = 
            commonContext.Get(key)
        member this.Insert(key, entity) =
            commonContext.Insert(key, entity)
        member this.Remove(key) =
            commonContext.Remove(key)
        member this.Update(key: IDocumentKey, updater: Submission -> Result<Submission,'TFail>) =
            commonContext.Update(key, updater)
        member this.Update(key: IDocumentKey, updater: Submission -> Submission) =
            commonContext.Update(key, updater)

        member this.GetByUser(userId) =
            async {
                try
                    let! (cluster : ICluster) = couchbaseCluster.GetClusterAsync()
                    let! bucket = this.GetBucket()
                    let queryOptions = 
                        QueryOptions()
                        |> fun x -> x.Parameter("type", Submission.TypeName)
                        |> fun x -> x.Parameter("owner_id", userId)
                    let! result = cluster.QueryAsync<Submission>
                                      (sprintf "SELECT `%s`.* FROM `%s` WHERE type = $type AND `permissions`.`owner_id` = $owner_id" bucket.Name bucket.Name,
                                       queryOptions)
                    let (submissionsAsync : IQueryResult<Submission>) = result
                    let submissions =
                        submissionsAsync
                        |> AsyncSeq.ofAsyncEnum
                        |> AsyncSeq.toBlockingSeq
                    return Result.Ok(submissions |> Seq.toList)
                with ex -> return Result.Error(GetDocumentFail.Error(ex))
            }

type ReportContext(couchbaseBuckets: CouchbaseBuckets, couchbaseCluster: CouchbaseCluster) =
    let commonContext = CommonContext<Report>(couchbaseBuckets) :> IContext<Report>

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
        member this.Update(key: IDocumentKey, updater: Report -> Result<Report,'TFail>) =
            commonContext.Update(key, updater)
        member this.Update(key: IDocumentKey, updater: Report -> Report) =
            commonContext.Update(key, updater)

        member this.GetByUser(userId) =
            async {
                try
                    let! (cluster : ICluster) = couchbaseCluster.GetClusterAsync()
                    let! bucket = this.GetBucket()
                    let queryOptions = 
                        QueryOptions()
                        |> fun x -> x.Parameter("type", Report.TypeName)
                        |> fun x -> x.Parameter("owner_id", userId)
                    let! result = cluster.QueryAsync<Report>
                                      (sprintf "SELECT `%s`.* FROM `%s` WHERE type = $type AND `permissions`.`owner_id` = $owner_id" bucket.Name bucket.Name,
                                       queryOptions)
                    let (reportsAsync : IQueryResult<Report>) = result
                    let reports =
                        reportsAsync
                        |> AsyncSeq.ofAsyncEnum
                        |> AsyncSeq.toBlockingSeq
                    return Result.Ok(reports |> Seq.toList)
                with ex -> return Result.Error(GetDocumentFail.Error(ex))
            }

type GeneratedProblemSetContext = CommonContext<GeneratedProblemSet>

type GeneratedProblemContext = CommonContext<GeneratedProblem>

type CommitContext = CommonContext<Commit>

type FolderContext = CommonContext<Folder>

type HeadContext = CommonContext<Head>

type ProblemContext = CommonContext<Problem>

type ProblemSetContext = CommonContext<ProblemSet>

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
        member this.Update(key: IDocumentKey, updater: UserGroups -> Result<UserGroups,'TFail>) =
            commonContext.Update(key, updater)
        member this.Update(key: IDocumentKey, updater: UserGroups -> UserGroups) =
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
        member this.Update(key: IDocumentKey, updater: User -> Result<User,'TFail>) =
            commonContext.Update(key, updater)
        member this.Update(key: IDocumentKey, updater: User -> User) =
            commonContext.Update(key, updater)
        
        member this.GetByName(name: string): Async<Result<User, GetDocumentFail>> =
            async {
                try
                    let! (cluster : ICluster) = couchbaseCluster.GetClusterAsync()
                    let! bucket = this.GetBucket()
                    let queryOptions = 
                        QueryOptions()
                        |> fun x -> x.Parameter("type", User.TypeName)
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
                        return Result.Error(GetDocumentFail.Error(InvalidOperationException("User not found")))
                    | Some(u) ->
                        return Result.Ok(u)
                with ex -> return Result.Error(GetDocumentFail.Error(ex))
            }

        member this.SearchByContainsInName(pattern: string): Async<Result<List<User>, GetDocumentFail>> =
            async {
                try
                    let! (cluster : ICluster) = couchbaseCluster.GetClusterAsync()
                    let! bucket = this.GetBucket()
                    let queryOptions = 
                        QueryOptions()
                        |> fun x -> x.Parameter("type", User.TypeName)
                        |> fun x -> x.Parameter("pattern", pattern.ToUpper())
                    let! result = cluster.QueryAsync<User>
                                      (sprintf "SELECT `%s`.* FROM `%s` WHERE type = $type AND CONTAINS(`%s`, $pattern)" bucket.Name bucket.Name normalizedName,
                                       queryOptions)
                    let (usersAsync : IQueryResult<User>) = result
                    let users =
                        usersAsync
                        |> AsyncSeq.ofAsyncEnum
                        |> AsyncSeq.toBlockingSeq
                    return Result.Ok(users |> List.ofSeq)
                with ex -> return Result.Error(GetDocumentFail.Error(ex))
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
        member this.Update(key: IDocumentKey, updater: UserRole -> Result<UserRole,'TFail>) =
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
                        |> fun x -> x.Parameter("type", UserRole.TypeName)
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
                        return Result.Ok(r)
                    | None ->
                        return Result.Error(GetDocumentFail.Error(InvalidOperationException(sprintf "User role %s not found" name)))
                with ex -> return Result.Error(GetDocumentFail.Error(ex))
            }