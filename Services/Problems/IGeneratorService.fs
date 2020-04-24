namespace Services.Problems

open CodeGeneratorContext
open Models.Problems
open Models.Identificators
open System

type IGeneratorService =
    abstract member Generate : ProblemId -> Async<Result<GeneratedProblemId, Exception>>
    abstract member Generate : ProblemSetId -> Async<Result<GeneratedProblemSetId, Exception>>
    abstract member Get : GeneratedProblemId -> Async<Result<GeneratedProblemModel, Exception>>
    abstract member Get : GeneratedProblemSetId -> Async<Result<GeneratedProblemSetModel, Exception>>
    abstract member Validate : GeneratedProblemId * ProblemAnswer -> Async<Result<bool, Exception>>
    abstract member TestGenerate : ProblemId * ProblemSeed -> Async<Result<GeneratedProblemModel, Exception>>
    abstract member TestValidate : ProblemId * expected:ProblemAnswer * actual:ProblemAnswer -> Async<Result<bool, Exception>>