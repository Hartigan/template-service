namespace Contexts

open DatabaseTypes
open Storage
open System
open System.Linq
open Couchbase
open Couchbase.Query
open Utils.AsyncHelper

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
                    let cluster = couchbaseCluster.Cluster
                    let! bucket = this.GetBucket()
                    let queryOptions = 
                        QueryOptions()
                        |> fun x -> x.AddNamedParameter("type", UserGroup.TypeName)
                        |> fun x -> x.AddNamedParameter("owner_id", userId)
                    let! result = cluster.QueryAsync<UserGroup>
                                      (sprintf "SELECT `%s`.* FROM `%s` WHERE type = $type AND owner_id = $owner_id" bucket.Name bucket.Name,
                                       queryOptions)
                    let (submissions : IQueryResult<UserGroup>) = result
                    return Result.Ok(submissions |> Seq.toList)
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
                    let cluster = couchbaseCluster.Cluster
                    let! bucket = this.GetBucket()
                    let queryOptions = 
                        QueryOptions()
                        |> fun x -> x.AddNamedParameter("type", Submission.TypeName)
                        |> fun x -> x.AddNamedParameter("owner_id", userId)
                    let! result = cluster.QueryAsync<Submission>
                                      (sprintf "SELECT `%s`.* FROM `%s` WHERE type = $type AND `permissions`.`owner_id` = $owner_id" bucket.Name bucket.Name,
                                       queryOptions)
                    let (submissions : IQueryResult<Submission>) = result
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
                    let cluster = couchbaseCluster.Cluster
                    let! bucket = this.GetBucket()
                    let queryOptions = 
                        QueryOptions()
                        |> fun x -> x.AddNamedParameter("type", Report.TypeName)
                        |> fun x -> x.AddNamedParameter("owner_id", userId)
                    let! result = cluster.QueryAsync<Report>
                                      (sprintf "SELECT `%s`.* FROM `%s` WHERE type = $type AND `permissions`.`owner_id` = $owner_id" bucket.Name bucket.Name,
                                       queryOptions)
                    let (reports : IQueryResult<Report>) = result
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
                    let cluster = couchbaseCluster.Cluster
                    let! bucket = this.GetBucket()
                    let queryOptions = 
                        QueryOptions()
                        |> fun x -> x.AddNamedParameter("type", User.TypeName)
                        |> fun x -> x.AddNamedParameter("normalized_name", name)
                    let! result = cluster.QueryAsync<User>
                                      (sprintf "SELECT `%s`.* FROM `%s` WHERE type = $type AND `%s` = $normalized_name LIMIT 1" bucket.Name bucket.Name normalizedName,
                                       queryOptions)
                    let (users : IQueryResult<User>) = result
                    return Result.Ok(users.First())
                with ex -> return Result.Error(GetDocumentFail.Error(ex))
            }

        member this.SearchByContainsInName(pattern: string): Async<Result<List<User>, GetDocumentFail>> =
            async {
                try
                    let cluster = couchbaseCluster.Cluster
                    let! bucket = this.GetBucket()
                    let queryOptions = 
                        QueryOptions()
                        |> fun x -> x.AddNamedParameter("type", User.TypeName)
                        |> fun x -> x.AddNamedParameter("pattern", pattern.ToUpper())
                    let! result = cluster.QueryAsync<User>
                                      (sprintf "SELECT `%s`.* FROM `%s` WHERE type = $type AND CONTAINS(`%s`, $pattern)" bucket.Name bucket.Name normalizedName,
                                       queryOptions)
                    let (users : IQueryResult<User>) = result
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
                    let cluster = couchbaseCluster.Cluster
                    let! bucket = this.GetBucket()
                    let queryOptions = 
                        QueryOptions()
                        |> fun x -> x.AddNamedParameter("type", UserRole.TypeName)
                        |> fun x -> x.AddNamedParameter("bucket", bucket.Name)
                        |> fun x -> x.AddNamedParameter("name_property", nameProperty)
                        |> fun x -> x.AddNamedParameter("name", name)
                    let! result = cluster.QueryAsync<UserRole>
                                      ("SELECT * as user_role FROM $bucket WHERE type = $type and $name_property = $name LIMIT 1",
                                       queryOptions)
                    let rows = (result : IQueryResult<UserRole>).Rows
                    if rows.Count > 0 then
                        return Result.Ok(rows.First())
                    else
                        return Result.Error(GetDocumentFail.Error(InvalidOperationException(sprintf "User role %s not found" name)))
                with ex -> return Result.Error(GetDocumentFail.Error(ex))
            }