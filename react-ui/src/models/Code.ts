

export enum CodeLanguage {
    CSharp = "csharp",
}

export enum ViewLanguage {
    Markdown = "markdown",
    PlainText = "plain_text",
    TeX = "tex"
}

export interface Code {
    language: CodeLanguage | ViewLanguage;
    content: string;
}