namespace DatabaseTypes

open System.Runtime.Serialization;

[<DataContract>]
type Template =
    {
        [<field: DataMember(Name = "id")>]
        Id : string
        [<field: DataMember(Name = "language")>]
        Language : string
        [<field: DataMember(Name = "content")>]
        Content : string
    }

    static member TypeName = "template"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, Template.TypeName)
    member private this.DocKey = Template.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        [<DataMember(Name = "type")>]
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key

