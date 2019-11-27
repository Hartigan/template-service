namespace Services.Problems

open CodeGeneratorContext
open Models.Problems
open System

type IControllerDelegateGenerator =
    abstract member CreateDelegate : ControllerModel -> Async<Result<Func<Generator, ControllerResult>, GenerateFail>>