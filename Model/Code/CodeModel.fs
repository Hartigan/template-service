namespace Models.Code

open DatabaseTypes
open Models.Identificators
open Models.Converters
open Models.Permissions
open System.Runtime.Serialization
open System.Text.Json.Serialization

type Language =
    | Markdown = 0
    | CSharp8 = 1
    | PlainText = 2

type LanguageModel private (name: string,  language: Language) =

    member val Name = name with get
    member val Language = language with get

    static member Create(language: string) : Result<LanguageModel, unit> =
        match language with
        | "csharp8" -> Result.Ok(LanguageModel(language, Language.CSharp8))
        | "markdown" -> Result.Ok(LanguageModel(language, Language.Markdown))
        | "plain_text" -> Result.Ok(LanguageModel(language, Language.PlainText))
        | _ -> Result.Error()


type LanguageModelConverter() =
    inherit StringConverter<LanguageModel>((fun m -> m.Name),
                                           (fun s ->
                                                match LanguageModel.Create(s) with
                                                | Result.Ok(languageModel) -> languageModel
                                                | Result.Error() -> failwith "Invalid language"))

type ContentModel(content: string) =
    member val Value = content with get

type ContentModelConverter() =
    inherit StringConverter<ContentModel>((fun m -> m.Value),
                                          (fun s -> ContentModel(s)))

type CodeModel private (language: LanguageModel, content: ContentModel) =
    [<DataMember(Name = "language")>]
    [<JsonConverter(typeof<LanguageModelConverter>)>]
    member val Language    = language with get
    [<DataMember(Name = "content")>]
    [<JsonConverter(typeof<ContentModelConverter>)>]
    member val Content     = content with get

    static member Create(code: Code) : Result<CodeModel, unit> =
        match LanguageModel.Create(code.Language) with
        | Result.Ok(languageModel) -> Result.Ok(CodeModel(languageModel, ContentModel(code.Content)))
        | Result.Error() -> Result.Error()
