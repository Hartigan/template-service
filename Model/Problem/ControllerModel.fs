namespace Models.Problems

open Utils.Converters
open Models.Code
open System.Text.Json.Serialization
open System

type ControllerLanguage =
    | CSharp

[<JsonConverter(typeof<ControllerLanguageModelConverter>)>]
type ControllerLanguageModel private (controllerLanguage: ControllerLanguage, model: LanguageModel) =

    member val Name = model.Name with get
    member val Language = controllerLanguage with get

    static member Create(model: LanguageModel) : Result<ControllerLanguageModel, Exception> =
        match model.Language with
        | Language.CSharp -> Ok(ControllerLanguageModel(ControllerLanguage.CSharp, model))
        | _ -> Error(InvalidOperationException(sprintf "cannot create ControllerLanguageModel") :> Exception)

    static member Create(language: ControllerLanguage) : ControllerLanguageModel =
        match language with
        | CSharp -> ControllerLanguageModel(CSharp, LanguageModel.Create(Language.CSharp))

and ControllerLanguageModelConverter() =
    inherit StringConverter<ControllerLanguageModel>((fun m -> m.Name),
                                                     (fun s ->
                                                          match LanguageModel.Create(s) with
                                                          | Ok(languageModel) ->
                                                              match ControllerLanguageModel.Create(languageModel) with
                                                              | Ok(controllerLanguageModel) -> controllerLanguageModel
                                                              | Error(ex) -> failwith ex.Message
                                                          | Error(ex) -> failwith ex.Message))

type ControllerModel =
    {
        [<JsonPropertyName("language")>]
        Language: ControllerLanguageModel
        [<JsonPropertyName("content")>]
        Content: ContentModel
    }
    static member Create(model: CodeModel) : Result<ControllerModel, Exception> =
        match ControllerLanguageModel.Create(model.Language) with
        | Ok(controllerLanguageModel) ->
            Ok({
                Language = controllerLanguageModel
                Content = model.Content
            })
        | Error(ex) -> Error(InvalidOperationException(sprintf "cannot create ControllerModel", ex) :> Exception)