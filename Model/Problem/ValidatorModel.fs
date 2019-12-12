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

type ValidatorModel private (language: ValidatorLanguageModel, content: ContentModel) =
    [<DataMember(Name = "language")>]
    member val Language    = language with get
    [<DataMember(Name = "content")>]
    member val Content     = content with get

    static member Create(model: CodeModel) : Result<ValidatorModel, unit> =
        match ValidatorLanguageModel.Create(model.Language) with
        | Result.Ok(validatorLanguageModel) -> Result.Ok(ValidatorModel(validatorLanguageModel, model.Content))
        | Result.Error() -> Result.Error()