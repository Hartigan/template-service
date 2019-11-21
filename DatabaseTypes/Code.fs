namespace DatabaseTypes

open System.Runtime.Serialization;

[<DataContract>]
type Code =
    {
        [<field: DataMember(Name = "id")>]
        Id : string
        [<field: DataMember(Name = "language")>]
        Language : string
        [<field: DataMember(Name = "content")>]
        Content : string
    }

    static member TypeName = "code"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, Code.TypeName)
    member private this.DocKey = Code.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        [<DataMember(Name = "type")>]
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
