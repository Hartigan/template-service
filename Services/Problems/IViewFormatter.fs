namespace Services.Problems

open CodeGeneratorContext
open Models.Problems
open System

type IViewFormatter =
    abstract member Format : ControllerResult * ViewModel -> Async<Result<GeneratedViewModel, Exception>>
