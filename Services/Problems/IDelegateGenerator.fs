namespace Services.Problems

open CodeGeneratorContext
open Models.Problems
open System

type IDelegateGenerator =
    abstract member CreateDelegate : ControllerModel -> Async<Result<Func<Generator, ControllerResult>, Exception>>
    abstract member CreateDelegate : ValidatorModel -> Async<Result<Func<Answer, Answer, bool>, Exception>>