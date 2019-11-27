namespace Models.Problems

open Models.Converters
open Models.Code
open System.Runtime.Serialization
open System.Text.Json.Serialization

type ViewLanguage =
    | Markdown
    | PlainText

type ViewLanguageModel private (viewLanguage: ViewLanguage, model: LanguageModel) =

    member val Name = model.Name with get
    member val Language = viewLanguage with get

    static member Create(model: LanguageModel) : Result<ViewLanguageModel, unit> =
        match model.Language with
        | Language.Markdown -> Result.Ok(ViewLanguageModel(ViewLanguage.Markdown, model))
        | Language.PlainText -> Result.Ok(ViewLanguageModel(ViewLanguage.PlainText, model))
        | _ -> Result.Error()

type ViewLanguageModelConverter() =
    inherit StringConverter<ViewLanguageModel>((fun m -> m.Name),
                                               (fun s ->
                                                    match LanguageModel.Create(s) with
                                                    | Result.Ok(languageModel) ->
                                                        match ViewLanguageModel.Create(languageModel) with
                                                        | Result.Ok(viewLanguageModel) -> viewLanguageModel
                                                        | Result.Error() -> failwith "Invalid view language"
                                                    | Result.Error() -> failwith "Invalid language"))

type ViewModel private (language: ViewLanguageModel, content: ContentModel) =
    [<DataMember(Name = "language")>]
    [<JsonConverter(typeof<ViewLanguageModelConverter>)>]
    member val Language    = language with get
    [<DataMember(Name = "content")>]
    [<JsonConverter(typeof<ContentModelConverter>)>]
    member val Content     = content with get

    static member Create(model: CodeModel) : Result<ViewModel, unit> =
        match ViewLanguageModel.Create(model.Language) with
        | Result.Ok(viewLanguageModel) -> Result.Ok(ViewModel(viewLanguageModel, model.Content))
        | Result.Error() -> Result.Error()
