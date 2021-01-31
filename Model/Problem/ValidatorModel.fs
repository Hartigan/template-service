namespace Models.Problems

open Utils.Converters
open Models.Code
open System.Text.Json.Serialization
open System

type ValidatorLanguage =
    | CSharp
    | IntegerValidator
    | FloatValidator
    | StringValidator

[<JsonConverter(typeof<ValidatorLanguageModelConverter>)>]
type ValidatorLanguageModel private (validatorLanguage: ValidatorLanguage, model: LanguageModel) =

    member val Name = model.Name with get
    member val Language = validatorLanguage with get

    static member Create(model: LanguageModel) : Result<ValidatorLanguageModel, Exception> =
        match model.Language with
        | Language.CSharp -> Ok(ValidatorLanguageModel(ValidatorLanguage.CSharp, model))
        | Language.IntegerValidator -> Ok(ValidatorLanguageModel(ValidatorLanguage.IntegerValidator, model))
        | Language.FloatValidator -> Ok(ValidatorLanguageModel(ValidatorLanguage.FloatValidator, model))
        | Language.StringValidator -> Ok(ValidatorLanguageModel(ValidatorLanguage.StringValidator, model))
        | _ -> Error(InvalidOperationException(sprintf "cannot create ValidatorLanguageModel") :> Exception)

    static member Create(language: ValidatorLanguage) : ValidatorLanguageModel =
        match language with
        | CSharp -> ValidatorLanguageModel(CSharp, LanguageModel.Create(Language.CSharp))
        | IntegerValidator -> ValidatorLanguageModel(IntegerValidator, LanguageModel.Create(Language.IntegerValidator))
        | FloatValidator -> ValidatorLanguageModel(FloatValidator, LanguageModel.Create(Language.FloatValidator))
        | StringValidator -> ValidatorLanguageModel(StringValidator, LanguageModel.Create(Language.StringValidator))
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