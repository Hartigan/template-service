

export enum ControllerLanguage {
    CSharp = "csharp",
}

export enum ViewLanguage {
    Markdown = "markdown",
    PlainText = "plain_text",
    TeX = "tex"
}

export enum ValidatorLanguage {
    CSharp = "csharp",
    IntegerValidator = "integer_validator",
    FloatValidator = "float_validator",
    StringValidator = "string_validator"
}

export interface Code {
    language: ControllerLanguage | ViewLanguage | ValidatorLanguage;
    content: string;
}