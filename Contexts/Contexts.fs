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
        member this.Update(key: IDocumentKey, updater: UserGroup -> Result<UserGroup, Exception>) =
            commonContext.Update(key, updater)
        member this.Update(key: IDocumentKey, updater: UserGroup -> UserGroup) =
            commonContext.Update(key, updater)

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
                    return Ok(groups |> List.ofSeq)
                with ex -> return Result.Error(ex)
            }

type SubmissionContext = CommonContext<Submission>

type ReportContext = CommonContext<Report>

type GeneratedProblemSetContext = CommonContext<GeneratedProblemSet>

type GeneratedProblemContext = CommonContext<GeneratedProblem>

type CommitContext = CommonContext<Commit>

type FolderContext = CommonContext<Folder>

type HeadContext = CommonContext<Head>

type ProblemContext = CommonContext<Problem>

type ProblemSetContext = CommonContext<ProblemSet>

type GroupItemsContext = CommonContext<GroupItems>

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
                        return Result.Error(InvalidOperationException("User not found") :> Exception)
                    | Some(u) ->
                        return Ok(u)
                with ex -> return Result.Error(ex)
            }

        member this.SearchByContainsInName(pattern: string): Async<Result<List<User>, Exception>> =
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
                        return Ok(r)
                    | None ->
                        return Result.Error(InvalidOperationException(sprintf "User role %s not found" name) :> Exception)
                with ex -> return Result.Error(ex)
            }