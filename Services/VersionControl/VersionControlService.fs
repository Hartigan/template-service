namespace Services.VersionControl

open Contexts
open DatabaseTypes
open Models.Identificators
open Models.Heads
open System

type VersionControlService(commitContext: IContext<Commit>, headContext: IContext<Head>) =
    interface IVersionControlService with
        member this.Create(name: HeadName, concreteId: ConcreteId, description: CommitDescription, userId: UserId) = 
            async {
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

                match! commitContext.Insert(commit, commit) with
                | Error(ex) -> return Error(ex)
                | Ok() ->
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
                    match! headContext.Insert(head, head) with
                    | Error(ex) -> return Error(ex)
                    | Ok() -> return Ok(HeadId(head.Id))
            }


        member this.Create(id: ConcreteId, description: CommitDescription, userId: UserId, headId: HeadId) =
            async {
                match! headContext.Get(Head.CreateDocumentKey(headId.Value)) with
                | Error(ex) -> return Error(ex)
                | Ok(head) ->
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

                    match! headContext.Update(Head.CreateDocumentKey(headId.Value), fun head ->
                        if head.Commit.Target.Type = commit.Target.Type then
                            Ok({ head with Commit = commit })
                        else
                            Error(InvalidOperationException("Wrong commit target type") :> Exception)) with
                    | Error(ex) -> return Error(ex)
                    | Ok() ->
                        match! commitContext.Insert(commit, commit) with
                        | Error(ex) -> return Error(ex)
                        | Ok() -> return Ok(CommitId(commit.Id))
            }


        member this.Get(headId: HeadId) =
            async {
                match! headContext.Get(Head.CreateDocumentKey(headId.Value)) with
                | Error(ex) -> return Error(ex)
                | Ok(head) -> return HeadModel.Create(head)
            }

        member this.Get(commitId: CommitId) =
            async {
                match! commitContext.Get(Commit.CreateDocumentKey(commitId.Value)) with
                | Error(ex) -> return Error(ex)
                | Ok(commit) -> return CommitModel.Create(commit)
            }