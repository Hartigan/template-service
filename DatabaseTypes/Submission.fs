namespace DatabaseTypes

open System.Runtime.Serialization
open System

[<DataContract>]
type ProblemAnswer = {
    [<field: DataMember(Name = "generated_problem_id")>]
    GeneratedProblemId : string
    [<field: DataMember(Name = "answer")>]
    Answer : string
    [<field: DataMember(Name = "timestamp")>]
    Timestamp : DateTimeOffset
}

[<DataContract>]
type Submission =
    {
        [<field: DataMember(Name = "id")>]
        Id : string
        [<field: DataMember(Name = "generated_problem_set_id")>]
        GeneratedProblemSetId : string
        [<field: DataMember(Name = "permissions")>]
        Permissions : Permissions
        [<field: DataMember(Name = "started_at")>]
        StartedAt : DateTimeOffset
        [<field: DataMember(Name = "deadline")>]
        Deadline : DateTimeOffset
        [<field: DataMember(Name = "answers")>]
        Answers : List<ProblemAnswer>
        [<field: DataMember(Name = "report_id")>]
        ReportId : string option
    }

    static member TypeName = "submission"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, Submission.TypeName)
    member private this.DocKey = Submission.CreateDocumentKey(this.Id)

    [<DataMember(Name = "type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key


