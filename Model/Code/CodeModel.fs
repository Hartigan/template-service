namespace Models.Code

open DatabaseTypes
open DatabaseTypes.Identificators
open Utils.Converters
open Models.Permissions
open System.Text.Json.Serialization
open System

type Language =
    | Markdown
    | CSharp
    | PlainText
    | Tex
    | IntegerValidator
    | FloatValidator
    | StringValidator

[<JsonConverter(typeof<LanguageModelConverter>)>]
type LanguageModel private (name: string,  language: Language) =

    member val Name = name with get
    member val Language = language with get

    static member Create(language: string) : Result<LanguageModel, Exception> =
        match language with
        | "csharp" -> Ok(LanguageModel(language, Language.CSharp))
        | "markdown" -> Ok(LanguageModel(language, Language.Markdown))
        | "plain_text" -> Ok(LanguageModel(language, Language.PlainText))
        | "tex" -> Ok(LanguageModel(language, Language.Tex))
        | "integer_validator" -> Ok(LanguageModel(language, Language.IntegerValidator))
        | "float_validator" -> Ok(LanguageModel(language, Language.FloatValidator))
        | "string_validator" -> Ok(LanguageModel(language, Language.StringValidator))
        | _ -> Error(InvalidOperationException(sprintf "Cannot create LanguageModel" ) :> Exception)

and LanguageModelConverter() =
    inherit StringConverter<LanguageModel>((fun m -> m.Name),
                                           (fun s ->
                                                match LanguageModel.Create(s) with
                                                | Ok(languageModel) -> languageModel
                                                | Error(ex) -> failwith ex.Message))

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

    static member Create(code: Code) : Result<CodeModel, Exception> =
        match LanguageModel.Create(code.Language) with
        | Ok(languageModel) -> Ok(CodeModel(languageModel, ContentModel(code.Content)))
        | Error(ex) -> Error(InvalidOperationException(sprintf "Cannot create CodeModel", ex) :> Exception)
