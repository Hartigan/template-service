namespace Services.Problems

open System

type GetFail =
    | Error of Exception

type CreateFail =
    | Error of Exception

type GenerateFail =
    | Error of Exception
