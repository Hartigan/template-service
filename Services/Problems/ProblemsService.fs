namespace Services.Problems

open System
open Contexts
open DatabaseTypes
open Models.Problems
open Models.Identificators

type ProblemsService(problemsContext: ProblemContext) =
    let problemsContext = (problemsContext :> IContext<Problem>)

    interface IProblemsService with
        member this.Create(model) = 
            async {
                let problem = {
                    Problem.Id = Guid.NewGuid().ToString()
                    Title = model.Title.Title
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

        member this.Get(id) =
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