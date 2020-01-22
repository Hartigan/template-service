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
                                                updater: ('T -> Result<'T, 'TFail>)): Async<Result<unit, GenericUpdateDocumentFail<'TFail>>> =
        async {
            try
                let! (getResult: IGetResult) = collection.GetAsync(key.Key, GetOptions())
                let item = getResult.ContentAs<'T>()
                let replaceOptions = ReplaceOptions()
                replaceOptions.Cas <- getResult.Cas
                let updateResult = updater(item)
                match updateResult with
                | Result.Error(error) -> return Result.Error(GenericUpdateDocumentFail<'TFail>.CustomFail(error))
                | Result.Ok(updatedItem) ->
                    let! replaceResult = collection.ReplaceAsync(key.Key, updatedItem)
                    return Result.Ok()

            with ex -> return Result.Error(GenericUpdateDocumentFail.Error(ex))
        }

    interface IContext<'T> with
        member this.Update(docKey: IDocumentKey, updater: 'T -> 'T) = 
            async {
                match! (this :> IContext<'T>).Update(docKey, updater >> Ok) with
                | Result.Error(fail) ->
                    match fail with
                    | GenericUpdateDocumentFail.Error(error) ->
                        return Result.Error(UpdateDocumentFail.Error(error))
                    | GenericUpdateDocumentFail.CustomFail() ->
                        return Result.Error(UpdateDocumentFail.Error(InvalidOperationException("Unexpected exception on update")))
                | Ok() ->
                    return Ok()
            }

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

                with ex -> return Result.Error(GenericUpdateDocumentFail.Error(ex))
            }

        member this.Get(key) =
            async {
                try
                    let! collection = this.GetCollection()
                    let! (getResult: IGetResult) = collection.GetAsync(key.Key)
                    return Result.Ok(getResult.ContentAs<'T>())

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

