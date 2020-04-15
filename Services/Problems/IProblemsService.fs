namespace Services.Problems

open Models.Problems
open Models.Identificators
open System

type IProblemsService =
    abstract member Get : ProblemId -> Async<Result<ProblemModel, Exception>>
    abstract member Create : ProblemModel -> Async<Result<ProblemId, Exception>>
    abstract member Get : ProblemSetId -> Async<Result<ProblemSetModel, Exception>>
    abstract member Create : ProblemSetModel -> Async<Result<ProblemSetId, Exception>>
    