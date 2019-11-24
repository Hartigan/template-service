namespace Models.Problems

open DatabaseTypes
open Models.Identificators
open Models.Converters
open Models.Code
open System.Runtime.Serialization
open System.Text.Json.Serialization

type ProblemTitle(title: string) =
    member val Title = title with get

type ProblemTitleConverter() =
    inherit StringConverter<ProblemTitle>((fun m -> m.Title),
                                           (fun s -> ProblemTitle(s)))

type ProblemModel private (id: ProblemId,
                           title: ProblemTitle,
                           view: ViewModel,
                           controller: ControllerModel,
                           validator: ValidatorModel) =
    [<DataMember(Name = "id")>]
    [<JsonConverter(typeof<ProblemIdConverter>)>]
    member val Id           = id with get                       
    [<DataMember(Name = "title")>]
    [<JsonConverter(typeof<ProblemTitleConverter>)>]
    member val Title        = title with get
    [<DataMember(Name = "view")>]
    member val View         = view with get
    [<DataMember(Name = "controller")>]
    member val Controller   = controller with get
    [<DataMember(Name = "validator")>]
    member val Validator    = view with get

    static member Create(problem: Problem) : Result<ProblemModel, unit> =
        let codes = (CodeModel.Create(problem.View), CodeModel.Create(problem.Controller), CodeModel.Create(problem.Validator))
        match codes with
        | (Ok(viewCode), Ok(controllerCode), Ok(validatorCode)) ->
            let codeModels = (ViewModel.Create(viewCode), ControllerModel.Create(controllerCode), ValidatorModel.Create(validatorCode))
            match codeModels with
            | (Ok(viewModel), Ok(controllerModel), Ok(validatorModel)) ->
                Ok(ProblemModel(ProblemId(problem.Id),
                                ProblemTitle(problem.Title),
                                viewModel,
                                controllerModel,
                                validatorModel))
            | _ -> Error()
        | _ -> Error()