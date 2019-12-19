namespace DatabaseTypes

open System.Runtime.Serialization
open System

[<DataContract>]
type ProblemReport = {
    [<field: DataMember(Name = "generated_problem_id")>]
    GeneratedProblemId : string
    [<field: DataMember(Name = "answer")>]
    Answer : string option
    [<field: DataMember(Name = "expected_answer")>]
    ExpectedAnswer : string
    [<field: DataMember(Name = "is_correct")>]
    IsCorrect : bool
    [<field: DataMember(Name = "timestamp")>]
    Timestamp : DateTimeOffset option
}

[<DataContract>]
type Report =
    {
        [<field: DataMember(Name = "id")>]
        Id : string
        [<field: DataMember(Name = "generated_problem_set_id")>]
        GeneratedProblemSetId : string
        [<field: DataMember(Name = "submission_id")>]
        SubmissionId : string
        [<field: DataMember(Name = "permissions")>]
        Permissions : Permissions
        [<field: DataMember(Name = "started_at")>]
        StartedAt : DateTimeOffset
        [<field: DataMember(Name = "finished_at")>]
        FinishedAt : DateTimeOffset
        [<field: DataMember(Name = "answers")>]
        Answers : List<ProblemReport>
    }

    static member TypeName = "report"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, Report.TypeName)
    member private this.DocKey = Report.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        [<DataMember(Name = "type")>]
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key


