namespace Services.VersionControl

open DatabaseTypes.Identificators
open Models.Heads
open System

type IVersionControlService =
    abstract member Get : CommitId -> Async<Result<CommitModel, Exception>>
    abstract member Get : HeadId -> Async<Result<HeadModel, Exception>>
    abstract member Create : ConcreteId * CommitDescription * UserId * HeadId -> Async<Result<CommitId, Exception>>
    abstract member Create : HeadName * ConcreteId * CommitDescription * UserId -> Async<Result<HeadId, Exception>>
    abstract member Update : HeadId * List<TagModel> -> Async<Result<unit, Exception>>
