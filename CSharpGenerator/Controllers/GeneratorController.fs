namespace CSharpGenerator.Controllers

open Microsoft.AspNetCore.Mvc
open Microsoft.Extensions.Logging
open CSharpGenerator

[<ApiController>]
[<Route("[controller]")>]
type GeneratorController (logger : ILogger<GeneratorController>,
                          processor: Processor) =
    inherit ControllerBase()

    [<HttpPost>]
    [<Route("generate")>]
    member this.Generate([<FromBody>] req: GenerateProblemDataRequest) =
        async {
            match! processor.Generate(req) with
            | Ok(data) -> return (JsonResult(data) :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Cannot generate data")
                return (BadRequestResult() :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("validate")>]
    member this.Validate([<FromBody>] req: ValidateProblemAnswerRequest) =
        async {
            match! processor.Validate(req) with
            | Ok(data) -> return (JsonResult(data) :> IActionResult)
            | Error(ex) ->
                logger.LogError(ex, "Cannot validate answer")
                return (BadRequestResult() :> IActionResult)
        }
        |> Async.StartAsTask