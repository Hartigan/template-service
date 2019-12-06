namespace Services.VersionControl

open Models.Identificators
open Models.Heads

type IVersionControlService =
    abstract member Get : CommitId -> Async<Result<CommitModel, GetFail>>
    abstract member Get : HeadId -> Async<Result<HeadModel, GetFail>>
    abstract member Create : ConcreteId * CommitDescription * CommitId * UserId -> Async<Result<CommitId, CreateFail>>
    abstract member MoveHead : HeadId * CommitId -> Async<Result<unit, MoveHeadFail>>
