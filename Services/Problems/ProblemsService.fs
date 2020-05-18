namespace Services.Problems

open System
open Contexts
open DatabaseTypes
open Models.Problems
open DatabaseTypes.Identificators
open System.Linq
open Utils.ResultHelper

type ProblemsService(problemsContext: IContext<Problem>, problemSetContext: IContext<ProblemSet>, headContext: IContext<Head>) =
    interface IProblemsService with
        member this.Create(model: ProblemSetModel) = 
            model.Heads
            |> Seq.map(fun headId -> headContext.Exists(Head.CreateDocumentKey(headId)))
            |> ResultOfAsyncSeq
            |> Async.BindResult(fun _ ->
                let problemSet =
                    {
                        ProblemSet.Id = ProblemSetId(Guid.NewGuid().ToString())
                        Type = ProblemSetType.Instance
                        Title = model.Title.Value
                        Heads = model.Heads
                        Duration = Convert.ToInt32(model.Duration.Value.TotalSeconds)
                    }

                problemSetContext.Insert(problemSet, problemSet)
                |> Async.MapResult(fun _ -> problemSet.Id)
            )
        member this.Get(id: ProblemSetId) =
            problemSetContext.Get(ProblemSet.CreateDocumentKey(id))
            |> Async.TryMapResult ProblemSetModel.Create

        member this.Create(model: ProblemModel) =
            let problem =
                {
                    Problem.Id = ProblemId(Guid.NewGuid().ToString())
                    Type = ProblemType.Instance
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

            problemsContext.Insert(problem, problem)
            |> Async.MapResult(fun _ -> problem.Id)

        member this.Get(id: ProblemId) =
            problemsContext.Get(Problem.CreateDocumentKey(id))
            |> Async.TryMapResult ProblemModel.Create
