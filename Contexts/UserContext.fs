namespace Contexts

open Domain
open Storage
open Contexts.Results
open System
open System.Linq
open Couchbase.Query
open Utils.AsyncHelper
open Utils

type UserContext(couchbaseBuckets: CouchbaseBuckets, couchbaseCluster: CouchbaseCluster) =
    inherit CommonContext<User>(couchbaseBuckets)

    let dummyUser = User()
    let normalizedName = ReflectionHelper.GetDataMemberName(<@ dummyUser.NormalizedName @>)

    member this.GetByName(name: string): Async<Result<User, GetFail>> =
        async {
            try
                let cluster = couchbaseCluster.Cluster
                let! bucket = this.GetBucket()
                let queryOptions = 
                    QueryOptions()
                    |> fun x -> x.AddNamedParameter("type", dummyUser.Type)
                    |> fun x -> x.AddNamedParameter("bucket", bucket.Name)
                    |> fun x -> x.AddNamedParameter("normalized_name_property", normalizedName)
                    |> fun x -> x.AddNamedParameter("normalized_name", name)
                let! result = cluster.QueryAsync<User>
                                  ("SELECT * as user FROM $bucket WHERE type = $type and $normalized_name_property = $normalized_name LIMIT 1",
                                   queryOptions)
                let rows = (result : IQueryResult<User>).Rows
                if rows.Count > 0 then
                    return Result.Ok(rows.First())
                else
                    return Result.Error(GetFail.Error(Exception("TODO")))
            with ex -> return Result.Error(GetFail.Error(ex))
        }
