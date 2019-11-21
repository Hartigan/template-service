namespace DatabaseTypes

type DocumentKey =
    {
        Key : string
        Type : string
    }
    static member Create(id: string, typeName: string): DocumentKey =
        { Key = sprintf "%s::%s" typeName id; Type = typeName }
    interface IDocumentKey with
        member this.Key with get() = this.Key
        member this.Type with get() = this.Type
