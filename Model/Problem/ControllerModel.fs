namespace Models.Problems

open Models.Converters
open Models.Code
open System.Runtime.Serialization
open System.Text.Json.Serialization

type ControllerLanguage =
    | CSharp

type ControllerLanguageModel private (controllerLanguage: ControllerLanguage, model: LanguageModel) =

    member val Name = model.Name with get
    member val Language = controllerLanguage with get

    static member Create(model: LanguageModel) : Result<ControllerLanguageModel, unit> =
        match model.Language with
        | Language.CSharp -> Result.Ok(ControllerLanguageModel(ControllerLanguage.CSharp, model))
        | _ -> Result.Error()

type ControllerLanguageModelConverter() =
    inherit StringConverter<ControllerLanguageModel>((fun m -> m.Name),
                                                     (fun s ->
                                                          match LanguageModel.Create(s) with
                                                          | Result.Ok(languageModel) ->
                                                              match ControllerLanguageModel.Create(languageModel) with
                                                              | Result.Ok(controllerLanguageModel) -> controllerLanguageModel
                                                              | Result.Error() -> failwith "Invalid controller language"
                                                          | Result.Error() -> failwith "Invalid language"))

type ControllerModel private (language: ControllerLanguageModel, content: ContentModel) =
    [<DataMember(Name = "language")>]
    [<JsonConverter(typeof<ControllerLanguageModelConverter>)>]
    member val Language    = language with get
    [<DataMember(Name = "content")>]
    [<JsonConverter(typeof<ContentModelConverter>)>]
    member val Content     = content with get

    static member Create(model: CodeModel) : Result<ControllerModel, unit> =
        match ControllerLanguageModel.Create(model.Language) with
        | Result.Ok(controllerLanguageModel) -> Result.Ok(ControllerModel(controllerLanguageModel, model.Content))
        | Result.Error() -> Result.Error()