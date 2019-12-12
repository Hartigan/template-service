namespace DatabaseTypes

open System.Runtime.Serialization

[<DataContract>]
type GeneratedProblem =
    {
        [<field: DataMember(Name = "id")>]
        Id : string
        [<field: DataMember(Name = "problem_id")>]
        ProblemId : string
        [<field: DataMember(Name = "seed")>]
        Seed : int32
        [<field: DataMember(Name = "title")>]
        Title : string
        [<field: DataMember(Name = "view")>]
        View : Code
        [<field: DataMember(Name = "answer")>]
        Answer : string
    }

    static member TypeName = "generated_problem"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, GeneratedProblem.TypeName)
    member private this.DocKey = GeneratedProblem.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        [<DataMember(Name = "type")>]
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
