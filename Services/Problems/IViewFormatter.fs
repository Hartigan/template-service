namespace Services.Problems

open Models.Problems
open System

type IViewFormatter =
    abstract member Format : List<ProblemParameter> * ViewModel -> Async<Result<GeneratedViewModel, Exception>>
