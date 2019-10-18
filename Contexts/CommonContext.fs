namespace Contexts

open Storage
open Contexts.Results
open Couchbase
open Couchbase.Core
open Utils.AsyncHelper
open System.Threading.Tasks
open System
open Couchbase.KeyValue

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

    member private this.DoUpdateAttempt(collection: ICollection, key: IDocumentKey, updater: ('T -> 'T)): Async<Result<unit, UpdateFail>> =
        async {
            try
                let! (getResult: IGetResult) = collection.GetAsync(key.Key, GetOptions())
                let item = getResult.ContentAs<'T>()
                let replaceOptions = ReplaceOptions()
                replaceOptions.Cas <- getResult.Cas
                let! updateResult = collection.ReplaceAsync(key.Key, updater(item))
                return Result.Ok()

            with ex -> return Result.Error(UpdateFail.Error(ex))
        }

    interface IContext<'T> with
        member this.Insert(key, doc) =
            async {
                try
                    let! collection = this.GetCollection()
                    let! insertResult = collection.InsertAsync(key.Key, doc, InsertOptions())
                    return Result.Ok(())
                with ex -> return Result.Error(InsertFail.Error(ex))
            } 

        member this.Remove(key) =
            async {
                try
                    let! collection = this.GetCollection()
                    do! collection.RemoveAsync(key.Key, RemoveOptions())
                    return Result.Ok(())
                with ex -> return Result.Error(RemoveFail.Error(ex))
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

                with ex -> return Result.Error(UpdateFail.Error(ex))
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
                                        | UpdateFail.Error(ex) -> return Result.Error(UpsertFail.Error(ex))
                    }

                    return! retroLoop updateAttempts

                with ex -> return Result.Error(UpsertFail.Error(ex))
            }


        member this.Get(key) =
            async {
                try
                    let! collection = this.GetCollection()
                    let! (getResult: IGetResult) = collection.GetAsync(key.Key, GetOptions())
                    return Result.Ok(getResult.ContentAs<'T>())

                with ex -> return Result.Error(GetFail.Error(ex))
            }
