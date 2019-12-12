namespace Services.Problems

open CodeGeneratorContext
open Models.Problems
open Models.Identificators

type IGeneratorService =
    abstract member GenerateProblem : ProblemModel -> Async<Result<GeneratedProblemId, GenerateFail>>
    abstract member GenerateProblemSet : ProblemSetModel -> Async<Result<GeneratedProblemSetId, GenerateFail>>
    abstract member Get : GeneratedProblemId -> Async<Result<GeneratedProblemModel, GetFail>>
    abstract member Get : GeneratedProblemSetId -> Async<Result<GeneratedProblemSetModel, GetFail>>