namespace Contexts.Results

open System

type UpdateFail(ex: Exception) =
    member val Error = ex