namespace Contexts

open DatabaseTypes
open Storage
open System
open System.Linq
open Couchbase.Query
open Utils.AsyncHelper
open Utils
open System.Collections.Generic

type GeneratedProblemSetContext = CommonContext<GeneratedProblemSet>

type GeneratedProblemContext = CommonContext<GeneratedProblem>

type CommitContext = CommonContext<Commit>

type FolderContext = CommonContext<Folder>

type HeadContext = CommonContext<Head>

type ProblemContext = CommonContext<Problem>

type ProblemSetContext = CommonContext<ProblemSet>

type UserContext(couchbaseBuckets: CouchbaseBuckets, couchbaseCluster: CouchbaseCluster) =
    inherit CommonContext<User>(couchbaseBuckets)

    let normalizedName = "normalized_name"

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
                                  (sprintf "SELECT `%s`.* FROM `%s` WHERE type = $type and `%s` = $normalized_name LIMIT 1" bucket.Name bucket.Name normalizedName,
                                   queryOptions)
                let (users : IQueryResult<User>) = result
                return Result.Ok(users.First())
            with ex -> return Result.Error(GetDocumentFail.Error(ex))
        }

type UserRoleContext(couchbaseBuckets: CouchbaseBuckets, couchbaseCluster: CouchbaseCluster) =
    inherit CommonContext<UserRole>(couchbaseBuckets)

    let nameProperty = "name"

    member this.GetByName(name: string): Async<Result<UserRole, GetDocumentFail>> =
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