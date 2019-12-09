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

    member internal this.GetCollection(): Async<ICollection> = 
        async {
            let! (bucket: IBucket) = couchbaseBuckets.GetMainBucketAsync()
            let (collection: ICollection) = bucket.DefaultCollection()
            return collection
        }

    member internal this.GetBucket(): Async<IBucket> =
        async {
            let! (bucket: IBucket) = couchbaseBuckets.GetMainBucketAsync()
            return bucket
        }

    member private this.DoUpdateAttempt<'TFail>(collection: ICollection,
                                                key: IDocumentKey,
                                                updater: ('T -> Result<'T, 'TFail>)): Async<Result<unit, UpdateDocumentFail<'TFail>>> =
        async {
            try
                let! (getResult: IGetResult) = collection.GetAsync(key.Key, GetOptions())
                let item = getResult.ContentAs<'T>()
                let replaceOptions = ReplaceOptions()
                replaceOptions.Cas <- getResult.Cas
                let updateResult = updater(item)
                match updateResult with
                | Result.Error(error) -> return Result.Error(UpdateDocumentFail<'TFail>.CustomFail(error))
                | Result.Ok(updatedItem) ->
                    let! replaceResult = collection.ReplaceAsync(key.Key, updatedItem)
                    return Result.Ok()

            with ex -> return Result.Error(UpdateDocumentFail.Error(ex))
        }

    interface IContext<'T> with
        member this.Insert(key, doc) =
            async {
                try
                    let! collection = this.GetCollection()
                    let! insertResult = collection.InsertAsync(key.Key, doc, InsertOptions())
                    return Result.Ok(())
                with ex -> return Result.Error(InsertDocumentFail.Error(ex))
            } 

        member this.Remove(key) =
            async {
                try
                    let! collection = this.GetCollection()
                    do! collection.RemoveAsync(key.Key, RemoveOptions())
                    return Result.Ok(())
                with ex -> return Result.Error(RemoveDocumentFail.Error(ex))
            }

        member this.Update(key, updater) = 
            async {
                try
                    let! collection = this.GetCollection()

                    let rec retroLoop (restAttemps) = async {
                        let! attemptResult = this.DoUpdateAttempt(collection, key, updater)

                        match attemptResult with
                            | Result.Ok(ok) -> 
                                return attemptResult
                            | Result.Error(error) ->
                                if restAttemps > 0 then
                                    return! retroLoop (restAttemps - 1)
                                else
                                    return attemptResult
                    }

                    return! retroLoop updateAttempts

                with ex -> return Result.Error(UpdateDocumentFail.Error(ex))
            }

        member this.Upsert(key, updater, getDefault) =
            async {
                try
                    let! collection = this.GetCollection()

                    let rec retroLoop (restAttemps) = async {
                        let! attemptResult = this.DoUpdateAttempt(collection, key, updater)

                        match attemptResult with
                            | Result.Ok(ok) -> 
                                return Result.Ok()
                            | Result.Error(error) -> 
                                if restAttemps > 0 then 
                                    return! retroLoop (restAttemps - 1)
                                else
                                    match error with
                                        | UpdateDocumentFail.Error(ex) ->
                                            return Result.Error(UpsertDocumentFail.Error(ex))
                                        | UpdateDocumentFail.CustomFail(customFail) ->
                                            return Result.Error(UpsertDocumentFail.CustomFail(customFail))
                    }

                    return! retroLoop updateAttempts

                with ex -> return Result.Error(UpsertDocumentFail.Error(ex))
            }


        member this.Get(key) =
            async {
                try
                    let! collection = this.GetCollection()
                    let! (getResult: IGetResult) = collection.GetAsync(key.Key)
                    // workaround for beta-1, fixed in beta-2
                    let jobject = getResult.ContentAs<JObject>()
                    let myObj = jobject.GetValue("").ToObject<'T>()
                    return Result.Ok(myObj)
                    //return Result.Ok(getResult.ContentAs<'T>())

                with ex -> return Result.Error(GetDocumentFail.Error(ex))
            }

        member this.Exists(key) =
            async {
                try
                    let! collection = this.GetCollection()
                    let! (existsResult: IExistsResult) = collection.ExistsAsync(key.Key)
                    return Result.Ok(existsResult.Exists)
                with ex -> return Result.Error(ExistsDocumentFail.Error(ex))
            }

