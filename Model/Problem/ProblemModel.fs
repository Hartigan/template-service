namespace Models.Problems

open DatabaseTypes
open DatabaseTypes.Identificators
open Utils.Converters
open Models.Code
open System.Text.Json.Serialization
open System
open Utils.ResultHelper

[<JsonConverter(typeof<ProblemTitleConverter>)>]
type ProblemTitle(title: string) =
    member val Value = title with get

and ProblemTitleConverter() =
    inherit StringConverter<ProblemTitle>((fun m -> m.Value),
                                          (fun s -> ProblemTitle(s)))

type ProblemModel =
    {
        [<JsonPropertyName("id")>]
        Id: ProblemId
        [<JsonPropertyName("title")>]
        Title: ProblemTitle
        [<JsonPropertyName("view")>]
        View: ViewModel
        [<JsonPropertyName("controller")>]
        Controller: ControllerModel
        [<JsonPropertyName("validator")>]
        Validator: ValidatorModel
    }
    static member Create(problem: Problem) : Result<ProblemModel, Exception> =
        let codes = (CodeModel.Create(problem.View), CodeModel.Create(problem.Controller), CodeModel.Create(problem.Validator))
        match codes with
        | (Ok(viewCode), Ok(controllerCode), Ok(validatorCode)) ->
            let codeModels = (ViewModel.Create(viewCode), ControllerModel.Create(controllerCode), ValidatorModel.Create(validatorCode))
            match codeModels with
            | (Ok(viewModel), Ok(controllerModel), Ok(validatorModel)) ->
                Ok({
                    ProblemModel.Id = problem.Id
                    Title = ProblemTitle(problem.Title)
                    View = viewModel
                    Controller = controllerModel
                    Validator = validatorModel
                })
            | errors -> Error(ErrorOf3 errors)
        | errors -> Error(ErrorOf3 errors)