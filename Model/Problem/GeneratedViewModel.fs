namespace Models.Problems

open Models.Converters
open Models.Code
open System.Runtime.Serialization
open System.Text.Json.Serialization

type GeneratedViewModel private (language: ViewLanguageModel, content: ContentModel) =
    [<JsonPropertyName("language")>]
    member val Language    = language with get
    [<JsonPropertyName("content")>]
    member val Content     = content with get

    static member Create(model: CodeModel) : Result<GeneratedViewModel, unit> =
        match ViewLanguageModel.Create(model.Language) with
        | Result.Ok(viewLanguageModel) -> Result.Ok(GeneratedViewModel(viewLanguageModel, model.Content))
        | Result.Error() -> Result.Error()

    static member Create(model: ViewModel, newContent: ContentModel) : GeneratedViewModel =
        GeneratedViewModel(model.Language, newContent)
