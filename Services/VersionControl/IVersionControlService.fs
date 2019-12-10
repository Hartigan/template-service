namespace Services.VersionControl

open Models.Identificators
open Models.Heads

type IVersionControlService =
    abstract member Get : CommitId -> Async<Result<CommitModel, GetFail>>
    abstract member Get : HeadId -> Async<Result<HeadModel, GetFail>>
    abstract member Create : ConcreteId * CommitDescription * UserId * HeadId -> Async<Result<CommitId, CreateFail>>
    abstract member Create : HeadName * ConcreteId * CommitDescription * UserId -> Async<Result<HeadId, CreateFail>>
