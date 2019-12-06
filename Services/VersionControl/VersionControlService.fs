namespace Services.VersionControl

open Contexts
open DatabaseTypes
open Models.Identificators
open Models.Heads
open System

type VersionControlService(commitContext: CommitContext, headContext: HeadContext) =
    let commitContext = (commitContext :> IContext<Commit>)
    let headContext = (headContext :> IContext<Head>)

    interface IVersionControlService with

        member this.Create(id, description, parentId, userId) =
            async {
                let target =
                    match id with
                    | ConcreteId.Problem(problemId) ->
                        { Target.Id = problemId.Value
                          Type = Problem.TypeName }

                let commit =
                    { Commit.Id = Guid.NewGuid().ToString()
                      AuthorId = userId.Value
                      Target = target
                      Timestamp = DateTimeOffset.UtcNow
                      ParentId = parentId.Value
                      Description = description.Value }

                match! commitContext.Insert(commit, commit) with
                | Result.Error(fail) ->
                    match fail with
                    | InsertDocumentFail.Error(error) -> return Result.Error(CreateFail.Error(error))
                | Result.Ok() -> return Result.Ok(CommitId(commit.Id))
            }


        member this.Get(headId: HeadId) =
            async {
                match! headContext.Get(Head.CreateDocumentKey(headId.Value)) with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) -> return Result.Error(GetFail.Error(error))
                | Result.Ok(head) ->
                    match HeadModel.Create(head) with
                    | Result.Error() ->
                        return Result.Error(GetFail.Error(InvalidOperationException("Cannot create HeadModel")))
                    | Result.Ok(model) -> return Result.Ok(model)
            }

        member this.MoveHead(headId, commitId) =
            async {
                match! commitContext.Get(Commit.CreateDocumentKey(commitId.Value)) with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) -> return Result.Error(MoveHeadFail.Error(error))
                | Result.Ok(commit) ->
                    match! headContext.Update(Head.CreateDocumentKey(headId.Value), fun head -> Result.Ok({ head with Commit = commit })) with
                    | Result.Error(fail) ->
                        match fail with
                        | UpdateDocumentFail.Error(error) -> return Result.Error(MoveHeadFail.Error(error))
                        | UpdateDocumentFail.CustomFail() -> return Result.Error(MoveHeadFail.Error(InvalidOperationException("Unexpected custom fail during MoveHead")))
                    | Result.Ok() -> return Result.Ok()
            }

        member this.Get(commitId: CommitId) =
            async {
                match! commitContext.Get(Commit.CreateDocumentKey(commitId.Value)) with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) -> return Result.Error(GetFail.Error(error))
                | Result.Ok(commit) ->
                    match CommitModel.Create(commit) with
                    | Result.Error() ->
                        return Result.Error(GetFail.Error(InvalidOperationException("Cannot create CommitModel")))
                    | Result.Ok(model) -> return Result.Ok(model)
            }