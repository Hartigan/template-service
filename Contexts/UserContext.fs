namespace Contexts

open DatabaseTypes
open Storage
open System
open System.Linq
open Couchbase.Query
open Utils.AsyncHelper
open Utils
open System.Collections.Generic

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
