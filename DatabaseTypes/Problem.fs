namespace DatabaseTypes

open System.Runtime.Serialization

[<DataContract>]
type Problem =
    {
        [<field: DataMember(Name = "id")>]
        Id : string
        [<field: DataMember(Name = "title")>]
        Title : string
        [<field: DataMember(Name = "view")>]
        View : Code
        [<field: DataMember(Name = "controller")>]
        Controller : Code
        [<field: DataMember(Name = "validator")>]
        Validator : Code
    }

    static member TypeName = "problem"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, Problem.TypeName)
    member private this.DocKey = Problem.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        [<DataMember(Name = "type")>]
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
