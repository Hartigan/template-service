namespace Models.Problems

open Utils.Converters
open Models.Code
open System.Text.Json.Serialization
open System

type ViewLanguage =
    | Markdown
    | PlainText
    | Tex

[<JsonConverter(typeof<ViewLanguageModelConverter>)>]
type ViewLanguageModel private (viewLanguage: ViewLanguage, model: LanguageModel) =

    member val Name = model.Name with get
    member val Language = viewLanguage with get

    static member Create(model: LanguageModel) : Result<ViewLanguageModel, Exception> =
        match model.Language with
        | Language.Markdown -> Ok(ViewLanguageModel(ViewLanguage.Markdown, model))
        | Language.PlainText -> Ok(ViewLanguageModel(ViewLanguage.PlainText, model))
        | Language.Tex -> Ok(ViewLanguageModel(ViewLanguage.Tex, model))
        | _ -> Error(InvalidOperationException(sprintf "cannot create ViewLanguageModel") :> Exception)

    static member Create(language: ViewLanguage) : ViewLanguageModel =
        match language with
        | Markdown -> ViewLanguageModel(Markdown, LanguageModel.Create(Language.Markdown))
        | PlainText -> ViewLanguageModel(PlainText, LanguageModel.Create(Language.PlainText))
        | Tex -> ViewLanguageModel(Tex, LanguageModel.Create(Language.Tex))

and ViewLanguageModelConverter() =
    inherit StringConverter<ViewLanguageModel>((fun m -> m.Name),
                                               (fun s ->
                                                    match LanguageModel.Create(s) with
                                                    | Ok(languageModel) ->
                                                        match ViewLanguageModel.Create(languageModel) with
                                                        | Ok(viewLanguageModel) -> viewLanguageModel
                                                        | Error(ex) -> failwith ex.Message
                                                    | Error(ex) -> failwith ex.Message))

type ViewModel =
    {
        [<JsonPropertyName("language")>]
        Language: ViewLanguageModel
        [<JsonPropertyName("content")>]
        Content: ContentModel
    }
    static member Create(model: CodeModel) : Result<ViewModel, Exception> =
        match ViewLanguageModel.Create(model.Language) with
        | Ok(viewLanguageModel) ->
            Ok({
                Language = viewLanguageModel
                Content = model.Content
            })
        | Error(ex) -> Error(InvalidOperationException(sprintf "cannot create ViewModel", ex) :> Exception)
