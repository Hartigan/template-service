namespace Services.Problems

open CodeGeneratorContext
open Models.Problems

type IGeneratorService =
    abstract member GenerateProblem : ProblemModel -> Async<Result<GeneratedProblemModel, GenerateFail>>