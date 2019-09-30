namespace Contexts.Results

open System

type RemoveFail(ex: Exception) =
    member val Error = ex