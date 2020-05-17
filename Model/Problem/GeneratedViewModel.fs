namespace Models.Problems

open Models.Converters
open Models.Code
open System.Text.Json.Serialization
open System

type GeneratedViewModel private (language: ViewLanguageModel, content: ContentModel) =
    [<JsonPropertyName("language")>]
    member val Language    = language with get
    [<JsonPropertyName("content")>]
    member val Content     = content with get

    static member Create(model: CodeModel) : Result<GeneratedViewModel, Exception> =
        match ViewLanguageModel.Create(model.Language) with
        | Ok(viewLanguageModel) -> Ok(GeneratedViewModel(viewLanguageModel, model.Content))
        | Error(ex) -> Error(InvalidOperationException(sprintf "cannot create GeneratedViewModel", ex) :> Exception)

    static member Create(model: ViewModel, newContent: ContentModel) : GeneratedViewModel =
        GeneratedViewModel(model.Language, newContent)
