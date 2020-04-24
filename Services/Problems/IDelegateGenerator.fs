namespace Services.Problems

open CodeGeneratorContext
open Models.Problems
open System

type IDelegateGenerator =
    abstract member CreateDelegate : ControllerModel -> Async<Result<Generator -> Result<ControllerResult, Exception>, Exception>>
    abstract member CreateDelegate : ValidatorModel -> Async<Result<Answer * Answer -> Result<bool, Exception>, Exception>>