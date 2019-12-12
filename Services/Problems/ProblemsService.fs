namespace Services.Problems

open System
open Contexts
open DatabaseTypes
open Models.Problems
open Models.Identificators
open System.Linq

type ProblemsService(problemsContext: ProblemContext, problemSetContext: ProblemSetContext, headContext: HeadContext) =
    let problemsContext = (problemsContext :> IContext<Problem>)
    let problemSetContext = (problemSetContext :> IContext<ProblemSet>)
    let headContext = (headContext :> IContext<Head>)

    interface IProblemsService with
        member this.Create(model: ProblemSetModel) = 
            async {
                let! exists =
                    model.Heads
                    |> Seq.map(fun headId -> 
                        async {
                            match! headContext.Exists(Head.CreateDocumentKey(headId.Value)) with
                            | Ok(exists) -> return exists
                            | _ -> return false
                        })
                    |> Async.Parallel
                let notExists = exists |> Seq.exists(fun exists -> not exists)

                if notExists then
                    return Result.Error(CreateFail.Error(InvalidOperationException("Some head ids not found")))
                else
                    let problemSet = {
                        ProblemSet.Id = Guid.NewGuid().ToString()
                        Title = model.Title.Value
                        Heads = model.Heads.Select(fun id -> id.Value).ToList()
                        Duration = int32(Math.Round(model.Duration.TotalSeconds))
                    }

                    match! problemSetContext.Insert(problemSet, problemSet) with
                    | Result.Error(fail) ->
                        match fail with
                        | InsertDocumentFail.Error(error) ->
                            return Result.Error(CreateFail.Error(error))
                    | Result.Ok(ok) ->
                        return Result.Ok(ProblemSetId(problemSet.Id))
            }
        member this.Get(id: ProblemSetId) = 
            async {
                let docId = ProblemSet.CreateDocumentKey(id.Value)
                let! result = problemSetContext.Get(docId)
                match result with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) -> return Result.Error(GetFail.Error(error))
                | Result.Ok(problemSet) ->
                    match ProblemSetModel.Create(problemSet) with
                    | Result.Error() -> return Result.Error(GetFail.Error(InvalidOperationException("Cannot create model from entity")))
                    | Result.Ok(problemSetModel) -> return Result.Ok(problemSetModel)
            }

        member this.Create(model: ProblemModel) = 
            async {
                let problem = {
                    Problem.Id = Guid.NewGuid().ToString()
                    Title = model.Title.Value
                    View = {
                        Code.Language = model.View.Language.Name
                        Content = model.View.Content.Value
                    }
                    Controller = {
                        Code.Language = model.Controller.Language.Name
                        Content = model.Controller.Content.Value
                    }
                    Validator = {
                        Code.Language = model.Validator.Language.Name
                        Content = model.Validator.Content.Value
                    }
                }

                let! result = problemsContext.Insert(problem, problem)

                match result with
                | Result.Error(fail) ->
                    match fail with
                    | InsertDocumentFail.Error(error) ->
                        return Result.Error(CreateFail.Error(error))
                | Result.Ok(ok) ->
                    return Result.Ok(ProblemId(problem.Id))
            }

        member this.Get(id: ProblemId) =
            async {
                let docId = Problem.CreateDocumentKey(id.Value)
                let! result = problemsContext.Get(docId)
                match result with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) -> return Result.Error(GetFail.Error(error))
                | Result.Ok(problem) ->
                    match ProblemModel.Create(problem) with
                    | Result.Error() -> return Result.Error(GetFail.Error(InvalidOperationException("Cannot create model from entity")))
                    | Result.Ok(problemModel) -> return Result.Ok(problemModel)
            }