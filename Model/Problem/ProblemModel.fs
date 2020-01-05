namespace Models.Problems

open DatabaseTypes
open Models.Identificators
open Models.Converters
open Models.Code
open System.Runtime.Serialization
open System.Text.Json.Serialization

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
    static member Create(problem: Problem) : Result<ProblemModel, unit> =
        let codes = (CodeModel.Create(problem.View), CodeModel.Create(problem.Controller), CodeModel.Create(problem.Validator))
        match codes with
        | (Ok(viewCode), Ok(controllerCode), Ok(validatorCode)) ->
            let codeModels = (ViewModel.Create(viewCode), ControllerModel.Create(controllerCode), ValidatorModel.Create(validatorCode))
            match codeModels with
            | (Ok(viewModel), Ok(controllerModel), Ok(validatorModel)) ->
                Ok({
                    ProblemModel.Id = ProblemId(problem.Id)
                    Title = ProblemTitle(problem.Title)
                    View = viewModel
                    Controller = controllerModel
                    Validator = validatorModel
                })
            | _ -> Error()
        | _ -> Error()