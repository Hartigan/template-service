namespace Services.VersionControl

open System

type GetFail =
    | Error of Exception

type CreateFail =
    | Error of Exception

type MoveHeadFail =
    | Error of Exception