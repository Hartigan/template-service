namespace Services.Problems

open CodeGeneratorContext
open Models.Problems

type IViewFormatter =
    abstract member Format : ControllerResult * ViewModel -> Async<Result<GeneratedViewModel, GenerateFail>>
