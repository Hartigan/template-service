namespace DatabaseTypes

open System.Runtime.Serialization

[<DataContract>]
type GeneratedProblemSet =
    {
        [<field: DataMember(Name = "id")>]
        Id : string
        [<field: DataMember(Name = "problems")>]
        Problems : List<string>
        [<field: DataMember(Name = "title")>]
        Title : string
        [<field: DataMember(Name = "view")>]
        Duration : int32
    }

    static member TypeName = "generated_problem_set"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, GeneratedProblemSet.TypeName)
    member private this.DocKey = GeneratedProblemSet.CreateDocumentKey(this.Id)

    [<DataMember(Name = "type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
