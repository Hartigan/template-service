namespace Models.Problems

open Utils.Converters
open Models.Code
open System.Text.Json.Serialization
open System

type ValidatorLanguage =
    | CSharp

[<JsonConverter(typeof<ValidatorLanguageModelConverter>)>]
type ValidatorLanguageModel private (validatorLanguage: ValidatorLanguage, model: LanguageModel) =

    member val Name = model.Name with get
    member val Language = validatorLanguage with get

    static member Create(model: LanguageModel) : Result<ValidatorLanguageModel, Exception> =
        match model.Language with
        | Language.CSharp -> Ok(ValidatorLanguageModel(ValidatorLanguage.CSharp, model))
        | _ -> Error(InvalidOperationException(sprintf "cannot create ValidatorLanguageModel") :> Exception)

and ValidatorLanguageModelConverter() =
    inherit StringConverter<ValidatorLanguageModel>((fun m -> m.Name),
                                               (fun s ->
                                                    match LanguageModel.Create(s) with
                                                    | Ok(languageModel) ->
                                                        match ValidatorLanguageModel.Create(languageModel) with
                                                        | Ok(validatorLanguageModel) -> validatorLanguageModel
                                                        | Error(ex) -> failwith ex.Message
                                                    | Error(ex) -> failwith ex.Message))

type ValidatorModel =
    {
        [<JsonPropertyName("language")>]
        Language: ValidatorLanguageModel
        [<JsonPropertyName("content")>]
        Content: ContentModel
    }
    static member Create(model: CodeModel) : Result<ValidatorModel, Exception> =
        match ValidatorLanguageModel.Create(model.Language) with
        | Ok(validatorLanguageModel) ->
            Ok({
                Language = validatorLanguageModel
                Content = model.Content
            })
        | Error(ex) -> Error(InvalidOperationException(sprintf "cannot create ValidatorModel", ex) :> Exception)