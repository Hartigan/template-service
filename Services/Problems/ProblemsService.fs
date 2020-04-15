namespace Services.Problems

open System
open Contexts
open DatabaseTypes
open Models.Problems
open Models.Identificators
open System.Linq

type ProblemsService(problemsContext: IContext<Problem>, problemSetContext: IContext<ProblemSet>, headContext: IContext<Head>) =
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
                    return Error(InvalidOperationException("Some head ids not found") :> Exception)
                else
                    let problemSet = {
                        ProblemSet.Id = Guid.NewGuid().ToString()
                        Title = model.Title.Value
                        Heads = model.Heads.Select(fun id -> id.Value).ToList()
                        Duration = Convert.ToInt32(model.Duration.Value.TotalSeconds)
                    }

                    match! problemSetContext.Insert(problemSet, problemSet) with
                    | Error(ex) -> return Error(ex)
                    | Ok(ok) -> return Ok(ProblemSetId(problemSet.Id))
            }
        member this.Get(id: ProblemSetId) = 
            async {
                let docId = ProblemSet.CreateDocumentKey(id.Value)
                let! result = problemSetContext.Get(docId)
                match result with
                | Error(ex) -> return Error(ex)
                | Ok(problemSet) -> return ProblemSetModel.Create(problemSet)
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
                | Error(ex) -> return Error(ex)
                | Ok(ok) -> return Ok(ProblemId(problem.Id))
            }

        member this.Get(id: ProblemId) =
            async {
                let docId = Problem.CreateDocumentKey(id.Value)
                let! result = problemsContext.Get(docId)
                match result with
                | Error(ex) -> return Error(ex)
                | Ok(problem) -> return ProblemModel.Create(problem)
            }