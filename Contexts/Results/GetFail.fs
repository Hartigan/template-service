namespace Contexts.Results

open System

type GetFail(ex: Exception) =
    member val Error = ex