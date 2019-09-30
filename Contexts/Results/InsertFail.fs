namespace Contexts.Results

open System

type InsertFail(ex: Exception) =
    member val Error = ex