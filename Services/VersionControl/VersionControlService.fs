namespace Services.VersionControl

open Contexts
open DatabaseTypes
open DatabaseTypes.Identificators
open Models.Heads
open System
open Services.Permissions
open Models.Permissions
open Utils.ResultHelper

type VersionControlService(commitContext: IContext<Commit>,
                           headContext: IHeadContext,
                           permissionsService: IPermissionsService,
                           headSearch: IHeadSearch) =
    interface IVersionControlService with
        member this.Search(userId, pattern, ownerId, tags, offset, limit) =
            permissionsService.Get(userId, AccessModel.CanRead, ProtectedType.Head)
            |> Async.MapResult(fun ids ->
                ids
                |> Seq.collect(fun id ->
                    match id with
                    | ProtectedId.Head(headId) -> Seq.singleton(headId)
                    | _ -> Seq.empty
                )
                |> List.ofSeq
            )
            |> Async.BindResult(fun headIds ->
                headSearch.Search(pattern, ownerId, tags |> List.map(fun x -> x.Value), headIds, offset, limit)
                |> Async.Map(fun heads ->
                    heads
                    |> List.map HeadModel.Create
                    |> ResultOfSeq
                )
            )


        member this.Update(headId, tags) = 
            headContext.Update(Head.CreateDocumentKey(headId), fun head ->
                {
                    head with
                        Tags =
                            tags
                            |> Seq.map(fun tag -> tag.Value)
                            |> Seq.distinct
                            |> List.ofSeq
                }
            )

        member this.Create(name: HeadName, concreteId: ConcreteId, description: CommitDescription, userId: UserId) = 
            let target =
                match concreteId with
                | ConcreteId.Problem(problemId) ->
                    { Target.Id = TargetId(problemId.Value)
                      Type = ProblemType.Instance.Value }
                | ConcreteId.ProblemSet(problemSetId) ->
                    { Target.Id = TargetId(problemSetId.Value)
                      Type = ProblemSetType.Instance.Value }
            let headId = HeadId(Guid.NewGuid().ToString())

            let commit =
                { Commit.Id = CommitId(Guid.NewGuid().ToString())
                  Type = CommitType.Instance
                  AuthorId = userId
                  HeadId = headId
                  Target = target
                  Timestamp = DateTimeOffset.UtcNow
                  ParentId = None
                  Description = description.Value }

            let head = {
                    Head.Id = headId
                    Type = HeadType.Instance
                    Permissions = {
                        OwnerId = userId
                        Groups = []
                        Members = []
                    }
                    Tags = []
                    Commit = commit
                    Name = name.Value
                }

            commitContext.Insert(commit, commit)
            |> Async.BindResult(fun _ -> headContext.Insert(head, head))
            |> Async.BindResult(fun _ -> permissionsService.UserItemsAppend(ProtectedId.Head(headId), userId))
            |> Async.MapResult(fun _ -> headId)

        member this.Create(id: ConcreteId, description: CommitDescription, userId: UserId, headId: HeadId) =
            headContext.Get(Head.CreateDocumentKey(headId))
            |> Async.BindResult(fun head ->
                let target =
                    match id with
                    | ConcreteId.Problem(problemId) ->
                        { Target.Id = TargetId(problemId.Value)
                          Type = ProblemType.Instance.Value }
                    | ConcreteId.ProblemSet(problemSetId) ->
                        { Target.Id = TargetId(problemSetId.Value)
                          Type = ProblemSetType.Instance.Value }

                let commit =
                    { Commit.Id = CommitId(Guid.NewGuid().ToString())
                      Type = CommitType.Instance
                      AuthorId = userId
                      HeadId = headId
                      Target = target
                      Timestamp = DateTimeOffset.UtcNow
                      ParentId = Some(head.Commit.Id)
                      Description = description.Value }
                headContext.Update
                    (Head.CreateDocumentKey(headId),
                    fun head ->
                        if head.Commit.Target.Type = commit.Target.Type then
                            Ok({ head with Commit = commit })
                        else
                            Error(InvalidOperationException("Wrong commit target type") :> Exception)
                    )
                |> Async.BindResult(fun _ -> commitContext.Insert(commit, commit))
                |> Async.MapResult(fun _ -> commit.Id)
            )

        member this.Get(headId: HeadId) =
            headContext.Get(Head.CreateDocumentKey(headId))
            |> Async.TryMapResult HeadModel.Create

        member this.Get(commitId: CommitId) =
            commitContext.Get(Commit.CreateDocumentKey(commitId))
            |> Async.TryMapResult CommitModel.Create
