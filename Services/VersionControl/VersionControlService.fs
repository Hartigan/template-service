namespace Services.VersionControl

open Contexts
open DatabaseTypes
open Models.Identificators
open Models.Heads
open System
open Services.Permissions
open Models.Permissions
open Utils.ResultHelper

type VersionControlService(commitContext: IContext<Commit>,
                           headContext: IContext<Head>,
                           permissionsService: IPermissionsService) =
    interface IVersionControlService with
        member this.Create(name: HeadName, concreteId: ConcreteId, description: CommitDescription, userId: UserId) = 
            let target =
                match concreteId with
                | ConcreteId.Problem(problemId) ->
                    { Target.Id = problemId.Value
                      Type = Problem.TypeName }
                | ConcreteId.ProblemSet(problemSetId) ->
                    { Target.Id = problemSetId.Value
                      Type = ProblemSet.TypeName }
            let headId = Guid.NewGuid().ToString()

            let commit =
                { Commit.Id = Guid.NewGuid().ToString()
                  AuthorId = userId.Value
                  HeadId = headId
                  Target = target
                  Timestamp = DateTimeOffset.UtcNow
                  ParentId = Guid.Empty.ToString()
                  Description = description.Value }

            let head = {
                    Head.Id = headId.ToString()
                    Permissions = {
                        OwnerId = userId.Value
                        Groups = []
                        Members = []
                    }
                    Commit = commit
                    Name = name.Value
                }

            let headId = HeadId(head.Id)

            commitContext.Insert(commit, commit)
            |> Async.BindResult(fun _ -> headContext.Insert(head, head))
            |> Async.BindResult(fun _ -> permissionsService.UserItemsAppend(ProtectedId.Head(headId), userId))
            |> Async.MapResult(fun _ -> headId)

        member this.Create(id: ConcreteId, description: CommitDescription, userId: UserId, headId: HeadId) =
            headContext.Get(Head.CreateDocumentKey(headId.Value))
            |> Async.BindResult(fun head ->
                let target =
                    match id with
                    | ConcreteId.Problem(problemId) ->
                        { Target.Id = problemId.Value
                          Type = Problem.TypeName }
                    | ConcreteId.ProblemSet(problemSetId) ->
                        { Target.Id = problemSetId.Value
                          Type = ProblemSet.TypeName }

                let commit =
                    { Commit.Id = Guid.NewGuid().ToString()
                      AuthorId = userId.Value
                      HeadId = headId.Value
                      Target = target
                      Timestamp = DateTimeOffset.UtcNow
                      ParentId = head.Commit.Id
                      Description = description.Value }
                headContext.Update
                    (Head.CreateDocumentKey(headId.Value),
                    fun head ->
                        if head.Commit.Target.Type = commit.Target.Type then
                            Ok({ head with Commit = commit })
                        else
                            Error(InvalidOperationException("Wrong commit target type") :> Exception)
                    )
                |> Async.BindResult(fun _ -> commitContext.Insert(commit, commit))
                |> Async.MapResult(fun _ -> CommitId(commit.Id))
            )

        member this.Get(headId: HeadId) =
            headContext.Get(Head.CreateDocumentKey(headId.Value))
            |> Async.TryMapResult HeadModel.Create

        member this.Get(commitId: CommitId) =
            commitContext.Get(Commit.CreateDocumentKey(commitId.Value))
            |> Async.TryMapResult CommitModel.Create
