namespace DatabaseTypes

type IDocumentKey =
    abstract member Key : string with get
    abstract member Type : string with get

