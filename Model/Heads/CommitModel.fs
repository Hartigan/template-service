namespace Models.Heads

open DatabaseTypes
open Models.Identificators
open System.Text.Json.Serialization
open Models.Converters
open System

[<JsonConverter(typeof<ModelTypeConverter>)>]
type ModelType =
    | Problem = 0
    | ProblemSet = 1
and ConcreteId = 
    | Problem of id:ProblemId
    | ProblemSet of id:ProblemSetId
    member this.Type =
        match this with
            | ConcreteId.Problem(id) -> ModelType.Problem
            | ConcreteId.ProblemSet(id) -> ModelType.ProblemSet
and ModelTypeConverter() =
    inherit StringConverter<ModelType>((fun m ->
                                            match m with
                                            | ModelType.Problem -> Problem.TypeName
                                            | ModelType.ProblemSet -> ProblemSet.TypeName
                                            | _ -> failwith "Invalid model type"),
                                       (fun s ->
                                            match ModelTypeConverter.Create(s) with
                                            | Ok(modelType) -> modelType
                                            | Error(ex) -> failwith ex.Message
                                       ))
    static member Create(typeName: string) : Result<ModelType, Exception> =
        if typeName = Problem.TypeName then
            Ok(ModelType.Problem)
        elif typeName = ProblemSet.TypeName then
            Ok(ModelType.ProblemSet)
        else
            Error(InvalidOperationException("cannot create ModelType") :> Exception)

type TargetModel private (targetId: TargetId, concreteId: ConcreteId) =


    [<JsonPropertyName("id")>]
    member val Id = targetId

    [<JsonIgnore>]
    member val ConcreteId = concreteId

    [<JsonPropertyName("type")>]
    member val Type = concreteId.Type

    static member Create(target: Target): Result<TargetModel, Exception> =
        if target.Type = Problem.TypeName then
            Ok(TargetModel(TargetId(target.Id), ConcreteId.Problem(ProblemId(target.Id))))
        elif target.Type = ProblemSet.TypeName then
            Ok(TargetModel(TargetId(target.Id), ConcreteId.ProblemSet(ProblemSetId(target.Id))))
        else Error(InvalidOperationException("cannot create TargetModel") :> Exception)

[<JsonConverter(typeof<CommitDescriptionConverter>)>]
type CommitDescription(description: string) =
    member val Value = description

and CommitDescriptionConverter() =
    inherit StringConverter<CommitDescription>((fun m -> m.Value), (fun s -> CommitDescription(s)))

type CommitModel private (id: CommitId, authorId: UserId, headId: HeadId, target: TargetModel, timestamp: DateTimeOffset, parentId: CommitId, description: CommitDescription) =


    [<JsonPropertyName("id")>]
    member val Id = id

    [<JsonPropertyName("author_id")>]
    member val AuthorId = authorId

    [<JsonPropertyName("head_id")>]
    member val HeadId = headId

    [<JsonPropertyName("target")>]
    member val Target = target

    [<JsonPropertyName("timestamp")>]
    member val Timestamp = timestamp

    [<JsonPropertyName("parent_id")>]
    member val ParentId = parentId

    [<JsonPropertyName("description")>]
    member val Description = description

    static member Create(commit: Commit): Result<CommitModel, Exception> =
        match TargetModel.Create(commit.Target) with
        | Error(ex) -> Error(InvalidOperationException("cannot create CommitModel", ex) :> Exception)
        | Ok(target) ->
            Ok
                (CommitModel
                    (CommitId(commit.Id), UserId(commit.AuthorId), HeadId(commit.HeadId), target, commit.Timestamp, CommitId(commit.ParentId),
                     CommitDescription(commit.Description)))
