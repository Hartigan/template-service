namespace Models.Problems

open Models.Converters
open Models.Code
open System.Runtime.Serialization
open System.Text.Json.Serialization

type ValidatorLanguage =
    | CSharp

[<JsonConverter(typeof<ValidatorLanguageModelConverter>)>]
type ValidatorLanguageModel private (validatorLanguage: ValidatorLanguage, model: LanguageModel) =

    member val Name = model.Name with get
    member val Language = validatorLanguage with get

    static member Create(model: LanguageModel) : Result<ValidatorLanguageModel, unit> =
        match model.Language with
        | Language.CSharp -> Result.Ok(ValidatorLanguageModel(ValidatorLanguage.CSharp, model))
        | _ -> Result.Error()

and ValidatorLanguageModelConverter() =
    inherit StringConverter<ValidatorLanguageModel>((fun m -> m.Name),
                                               (fun s ->
                                                    match LanguageModel.Create(s) with
                                                    | Result.Ok(languageModel) ->
                                                        match ValidatorLanguageModel.Create(languageModel) with
                                                        | Result.Ok(validatorLanguageModel) -> validatorLanguageModel
                                                        | Result.Error() -> failwith "Invalid validator language"
                                                    | Result.Error() -> failwith "Invalid language"))

type ValidatorModel =
    {
        [<JsonPropertyName("language")>]
        Language: ValidatorLanguageModel
        [<JsonPropertyName("content")>]
        Content: ContentModel
    }
    static member Create(model: CodeModel) : Result<ValidatorModel, unit> =
        match ValidatorLanguageModel.Create(model.Language) with
        | Result.Ok(validatorLanguageModel) ->
            Ok({
                Language = validatorLanguageModel
                Content = model.Content
            })
        | Result.Error() -> Result.Error()