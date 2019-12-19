namespace Services.Problems

open CodeGeneratorContext
open Models.Problems
open Models.Identificators

type IGeneratorService =
    abstract member Generate : ProblemId -> Async<Result<GeneratedProblemId, GenerateFail>>
    abstract member Generate : ProblemSetId -> Async<Result<GeneratedProblemSetId, GenerateFail>>
    abstract member Get : GeneratedProblemId -> Async<Result<GeneratedProblemModel, GetFail>>
    abstract member Get : GeneratedProblemSetId -> Async<Result<GeneratedProblemSetModel, GetFail>>
    abstract member Validate : GeneratedProblemId * ProblemAnswer -> Async<Result<bool, GenerateFail>>