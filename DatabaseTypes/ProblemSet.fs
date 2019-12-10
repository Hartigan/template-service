namespace DatabaseTypes

open System.Runtime.Serialization

[<DataContract>]
type ProblemSet =
    {
        [<field: DataMember(Name = "id")>]
        Id : string
        [<field: DataMember(Name = "title")>]
        Title : string
        [<field: DataMember(Name = "head_ids")>]
        Heads : System.Collections.Generic.List<string>
    }

    static member TypeName = "problem_set"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, Problem.TypeName)
    member private this.DocKey = Problem.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        [<DataMember(Name = "type")>]
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
