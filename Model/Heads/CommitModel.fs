namespace Models.Heads

open DatabaseTypes
open Models.Identificators
open System.Runtime.Serialization
open System.Text.Json.Serialization
open Models.Converters
open System

[<JsonConverter(typeof<ConcreteIdConverter>)>]
type ConcreteId = 
| Problem of ProblemId
| ProblemSet of ProblemSetId

and ConcreteIdConverter() =
    inherit StringConverter<ConcreteId>((fun m ->
                                        match m with
                                        | ConcreteId.Problem(id) -> Problem.TypeName
                                        | ConcreteId.ProblemSet(id) -> ProblemSet.TypeName),
                                        (fun s ->
                                        if s = Problem.TypeName then ConcreteId.Problem(ProblemId(s))
                                        elif s = ProblemSet.TypeName then ConcreteId.ProblemSet(ProblemSetId(s))
                                        else failwith (sprintf "Incorrect type '%s'" s)))

type TargetModel private (targetId: TargetId, typeName: string, concreteId: ConcreteId) =


    [<DataMember(Name = "id")>]
    member val Id = targetId

    [<DataMember(Name = "type")>]
    member val ConcreteId = concreteId

    static member Create(target: Target): Result<TargetModel, unit> =
        if target.Type = Problem.TypeName then
            Result.Ok(TargetModel(TargetId(target.Id), Problem.TypeName, ConcreteId.Problem(ProblemId(target.Id))))
        else Result.Error()

[<JsonConverter(typeof<CommitDescriptionConverter>)>]
type CommitDescription(description: string) =
    member val Value = description

and CommitDescriptionConverter() =
    inherit StringConverter<CommitDescription>((fun m -> m.Value), (fun s -> CommitDescription(s)))

type CommitModel private (id: CommitId, authorId: UserId, headId: HeadId, target: TargetModel, timestamp: DateTimeOffset, parentId: CommitId, description: CommitDescription) =


    [<DataMember(Name = "id")>]
    member val Id = id

    [<DataMember(Name = "author_id")>]
    member val AuthorId = authorId

    [<DataMember(Name = "head_id")>]
    member val HeadId = headId

    [<DataMember(Name = "target")>]
    member val Target = target

    [<DataMember(Name = "timestamp")>]
    member val Timestamp = timestamp

    [<DataMember(Name = "parent_id")>]
    member val ParentId = parentId

    [<DataMember(Name = "description")>]
    member val Description = description

    static member Create(commit: Commit): Result<CommitModel, unit> =
        match TargetModel.Create(commit.Target) with
        | Result.Error() -> Result.Error()
        | Result.Ok(target) ->
            Result.Ok
                (CommitModel
                    (CommitId(commit.Id), UserId(commit.AuthorId), HeadId(commit.HeadId), target, commit.Timestamp, CommitId(commit.ParentId),
                     CommitDescription(commit.Description)))
