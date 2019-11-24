namespace Services.Problems

open Models.Problems
open Models.Identificators

type IProblemsService =
    abstract member Get : ProblemId -> Async<Result<ProblemModel, GetFail>>
    abstract member Create : ProblemModel -> Async<Result<ProblemId, CreateFail>>