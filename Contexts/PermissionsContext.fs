namespace Contexts

open Storage
open Couchbase
open Couchbase.Core
open Utils.AsyncHelper
open System.Threading.Tasks
open System
open Couchbase.KeyValue
open Newtonsoft.Json.Linq
open System.Collections.Generic
open DatabaseTypes
open Couchbase.Core.IO.Operations.SubDocument

type PermissionsContext(couchbaseBuckets: CouchbaseBuckets) = 

    let updateAttempts = 10
    let specs = seq {
        LookupInSpec.Get("permissions")
    }

    member internal this.GetCollection(): Async<ICouchbaseCollection> = 
        async {
            let! (bucket: IBucket) = couchbaseBuckets.GetMainBucketAsync()
            let (collection: ICouchbaseCollection) = bucket.DefaultCollection()
            return collection
        }

    member internal this.GetBucket(): Async<IBucket> =
        async {
            let! (bucket: IBucket) = couchbaseBuckets.GetMainBucketAsync()
            return bucket
        }

    member private this.DoUpdateAttempt(collection: ICouchbaseCollection,
                                        key: IDocumentKey,
                                        updater: (Permissions -> Result<Permissions, Exception>)) =
        async {
            try
                let! (getResult: ILookupInResult) =
                    collection.LookupInAsync(key.Key, specs)
                let item = getResult.ContentAs<Permissions>(0)
                let replaceOptions = ReplaceOptions().Cas(getResult.Cas)
                let updateResult = updater(item)
                match updateResult with
                | Error(error) -> return Error(error)
                | Ok(updatedItem) ->
                    let replaceSpecs = seq {
                        MutateInSpec.Replace("permissions", updatedItem)
                    }
                    let! replaceResult = collection.MutateInAsync(key.Key, replaceSpecs)
                    return Ok()

            with ex -> return Error(ex)
        }

    interface IPermissionsContext with
        member this.Update(key, updater) = 
            async {
                try
                    let! collection = this.GetCollection()

                    let rec retroLoop (restAttemps) = async {
                        let! attemptResult = this.DoUpdateAttempt(collection, key, updater)

                        match attemptResult with
                            | Ok(ok) -> 
                                return attemptResult
                            | Error(error) ->
                                if restAttemps > 0 then
                                    return! retroLoop (restAttemps - 1)
                                else
                                    return attemptResult
                    }

                    return! retroLoop updateAttempts

                with ex -> return Error(ex)
            }

        member this.Update(docKey: IDocumentKey, updater: Permissions -> Permissions) = 
            async {
                return! (this :> IPermissionsContext).Update(docKey, updater >> Ok)
            }

        member this.Get(key) =
            async {
                try
                    let! collection = this.GetCollection()
                    let! (getResult: ILookupInResult) = collection.LookupInAsync(key.Key, specs)
                    return Ok(getResult.ContentAs<Permissions>(0))

                with ex -> return Error(ex)
            }

        member this.Exists(key) =
            async {
                try
                    let! collection = this.GetCollection()
                    let! (existsResult: IExistsResult) = collection.ExistsAsync(key.Key)
                    return Ok(existsResult.Exists)
                with ex -> return Error(ex)
            }

