namespace CSharpGenerator.Controllers

open Microsoft.AspNetCore.Mvc
open Microsoft.Extensions.Logging
open CSharpGenerator
open System.Text.Json.Serialization
open System.Text.Json

module JsonHelper =
    let JsonOptions = JsonSerializerOptions()
    JsonOptions.Converters.Add(JsonFSharpConverter())

[<ApiController>]
type SimpleValidatorsController(logger: ILogger<SimpleValidatorsController>,
                                integerValidator: ISimpleValidator<IntValidatorOptions>,
                                floatValidator: ISimpleValidator<FloatValidatorOptions>,
                                stringValidator: ISimpleValidator<StringValidatorOptions>,
                                processor: Processor) =
    inherit ControllerBase()

    [<HttpPost>]
    [<Route("integer/validate")>]
    member this.ValidateInteger([<FromBody>] req: ValidateProblemAnswerRequest) =
        async {
            let options = JsonSerializer.Deserialize<IntValidatorOptions>(req.Code, JsonHelper.JsonOptions)
            let result = integerValidator.Validate(req.Expected, req.Actual, options)
            return (JsonResult({ ValidateProblemAnswerResponse.IsCorrect = result }) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("float/validate")>]
    member this.ValidateFloat([<FromBody>] req: ValidateProblemAnswerRequest) =
        async {
            let options = JsonSerializer.Deserialize<FloatValidatorOptions>(req.Code, JsonHelper.JsonOptions)
            let result = floatValidator.Validate(req.Expected, req.Actual, options)
            return (JsonResult({ ValidateProblemAnswerResponse.IsCorrect = result }) :> IActionResult)
        }
        |> Async.StartAsTask

    [<HttpPost>]
    [<Route("string/validate")>]
    member this.Validate([<FromBody>] req: ValidateProblemAnswerRequest) =
        async {
            let options = JsonSerializer.Deserialize<StringValidatorOptions>(req.Code, JsonHelper.JsonOptions)
            let result = stringValidator.Validate(req.Expected, req.Actual, options)
            return (JsonResult({ ValidateProblemAnswerResponse.IsCorrect = result }) :> IActionResult)
        }
        |> Async.StartAsTask