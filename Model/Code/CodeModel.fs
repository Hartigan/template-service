namespace Models.Code

open DatabaseTypes
open Models.Identificators
open Models.Converters
open Models.Permissions
open System.Runtime.Serialization
open System.Text.Json.Serialization

type Language =
    | Markdown
    | CSharp
    | PlainText

[<JsonConverter(typeof<LanguageModelConverter>)>]
type LanguageModel private (name: string,  language: Language) =

    member val Name = name with get
    member val Language = language with get

    static member Create(language: string) : Result<LanguageModel, unit> =
        match language with
        | "csharp" -> Result.Ok(LanguageModel(language, Language.CSharp))
        | "markdown" -> Result.Ok(LanguageModel(language, Language.Markdown))
        | "plain_text" -> Result.Ok(LanguageModel(language, Language.PlainText))
        | _ -> Result.Error()

and LanguageModelConverter() =
    inherit StringConverter<LanguageModel>((fun m -> m.Name),
                                           (fun s ->
                                                match LanguageModel.Create(s) with
                                                | Result.Ok(languageModel) -> languageModel
                                                | Result.Error() -> failwith "Invalid language"))

[<JsonConverter(typeof<ContentModelConverter>)>]
type ContentModel(content: string) =
    member val Value = content with get

and ContentModelConverter() =
    inherit StringConverter<ContentModel>((fun m -> m.Value),
                                          (fun s -> ContentModel(s)))

type CodeModel private (language: LanguageModel, content: ContentModel) =
    [<JsonPropertyName("language")>]
    member val Language    = language with get
    [<JsonPropertyName("content")>]
    member val Content     = content with get

    static member Create(code: Code) : Result<CodeModel, unit> =
        match LanguageModel.Create(code.Language) with
        | Result.Ok(languageModel) -> Result.Ok(CodeModel(languageModel, ContentModel(code.Content)))
        | Result.Error() -> Result.Error()
