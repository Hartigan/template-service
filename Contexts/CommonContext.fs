namespace Contexts

open Storage
open Couchbase
open Couchbase.Core
open Utils.AsyncHelper
open System.Threading.Tasks
open System
open Couchbase.KeyValue
open Newtonsoft.Json.Linq
open DatabaseTypes

type CommonContext<'T>(couchbaseBuckets: CouchbaseBuckets) = 

    let updateAttempts = 10  

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
                                        updater: ('T -> Result<'T, Exception>)): Async<Result<unit, Exception>> =
        async {
            try
                let! (getResult: IGetResult) = collection.GetAsync(key.Key)
                let item = getResult.ContentAs<'T>()
                let replaceOptions = ReplaceOptions().Cas(getResult.Cas)
                let updateResult = updater(item)
                match updateResult with
                | Error(error) -> return Error(error)
                | Ok(updatedItem) ->
                    let! replaceResult = collection.ReplaceAsync(key.Key, updatedItem, replaceOptions)
                    return Ok()

            with ex -> return Error(ex)
        }

    interface IContext<'T> with
        member this.Update(docKey: IDocumentKey, updater: 'T -> 'T) = 
            async {
                return! (this :> IContext<'T>).Update(docKey, updater >> Ok)
            }

        member this.Insert(key, doc) =
            async {
                try
                    let! collection = this.GetCollection()
                    let! insertResult = collection.InsertAsync(key.Key, doc, InsertOptions())
                    return Ok(())
                with ex -> return Error(ex)
            } 

        member this.Remove(key) =
            async {
                try
                    let! collection = this.GetCollection()
                    do! collection.RemoveAsync(key.Key, RemoveOptions())
                    return Ok(())
                with ex -> return Error(ex)
            }

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

        member this.Get(key) =
            async {
                try
                    let! collection = this.GetCollection()
                    let! (getResult: IGetResult) = collection.GetAsync(key.Key)
                    return Ok(getResult.ContentAs<'T>())

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

