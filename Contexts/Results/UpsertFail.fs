namespace Contexts.Results

open System

type UpsertFail(ex: Exception) =
    member val Error = ex