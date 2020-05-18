namespace Models.Heads

open DatabaseTypes
open DatabaseTypes.Identificators
open System.Text.Json.Serialization
open Utils.Converters
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
                                            | ModelType.Problem -> ProblemType.Instance.Value
                                            | ModelType.ProblemSet -> ProblemSetType.Instance.Value
                                            | _ -> failwith "Invalid model type"),
                                       (fun s ->
                                            match ModelTypeConverter.Create(s) with
                                            | Ok(modelType) -> modelType
                                            | Error(ex) -> failwith ex.Message
                                       ))
    static member Create(typeName: string) : Result<ModelType, Exception> =
        if typeName = ProblemType.Instance.Value then
            Ok(ModelType.Problem)
        elif typeName = ProblemSetType.Instance.Value then
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
        if target.Type = ProblemType.Instance.Value then
            Ok(TargetModel(target.Id, ConcreteId.Problem(ProblemId(target.Id.Value))))
        elif target.Type = ProblemSetType.Instance.Value then
            Ok(TargetModel(target.Id, ConcreteId.ProblemSet(ProblemSetId(target.Id.Value))))
        else Error(InvalidOperationException("cannot create TargetModel") :> Exception)

[<JsonConverter(typeof<CommitDescriptionConverter>)>]
type CommitDescription(description: string) =
    member val Value = description

and CommitDescriptionConverter() =
    inherit StringConverter<CommitDescription>((fun m -> m.Value), (fun s -> CommitDescription(s)))

type CommitModel =
    {
        [<JsonPropertyName("id")>]
        Id          : CommitId

        [<JsonPropertyName("author_id")>]
        AuthorId    : UserId

        [<JsonPropertyName("head_id")>]
        HeadId      : HeadId

        [<JsonPropertyName("target")>]
        Target      : TargetModel

        [<JsonPropertyName("timestamp")>]
        Timestamp   : DateTimeOffset

        [<JsonPropertyName("parent_id")>]
        ParentId    : CommitId option

        [<JsonPropertyName("description")>]
        Description : CommitDescription
    }

    static member Create(commit: Commit): Result<CommitModel, Exception> =
        match TargetModel.Create(commit.Target) with
        | Error(ex) -> Error(InvalidOperationException("cannot create CommitModel", ex) :> Exception)
        | Ok(target) ->
            Ok({
                Id          = commit.Id
                AuthorId    = commit.AuthorId
                HeadId      = commit.HeadId
                Target      = target
                Timestamp   = commit.Timestamp
                ParentId    = commit.ParentId
                Description = CommitDescription(commit.Description)
            })
