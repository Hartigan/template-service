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
            model.Slots
            |> Seq.collect(fun slot -> slot.Heads)
            |> Seq.map (Head.CreateDocumentKey >> headContext.Exists)
            |> ResultOfAsyncSeq
            |> Async.BindResult(fun isExists ->
                let isAllExists =
                    isExists
                    |> Seq.fold (&&) (true)

                if isAllExists then
                    let problemSet =
                        {
                            ProblemSet.Id = ProblemSetId(Guid.NewGuid().ToString())
                            Type = ProblemSetType.Instance
                            Title = model.Title.Value
                            Slots = model.Slots |> Seq.map(fun slot -> { Slot.Heads = slot.Heads }) |> List.ofSeq
                            Duration = Convert.ToInt32(model.Duration.Value.TotalSeconds)
                        }

                    problemSetContext.Insert(problemSet, problemSet)
                    |> Async.MapResult(fun _ -> problemSet.Id)
                else
                    async.Return(Error(InvalidOperationException("Some heads doesn't exists") :> Exception))
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
