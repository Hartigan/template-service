namespace Services.Problems

open System
open DatabaseTypes
open Models.Problems
open Contexts
open CodeGeneratorContext
open System.Linq
open Services.VersionControl
open Models.Identificators
open Models.Heads
open Utils.ResultHelper

module Async = 
    let flatMap f x = async.Bind(x, f)

type GeneratorService(viewFormatter: IViewFormatter,
                      generatedProblemContext: IContext<GeneratedProblem>,
                      generatedProblemSetContext: IContext<GeneratedProblemSet>,
                      problemsService: IProblemsService,
                      versionControlService: IVersionControlService) =

    let csharpGenerator = (CSharpDelegateGenerator() :> IDelegateGenerator)
    let random = Random(0)

    member this.CreateGeneratedProblem(problem: ProblemModel, seed: ProblemSeed): Async<Result<GeneratedProblem, Exception>> =
        match problem.Controller.Language.Language with
        | ControllerLanguage.CSharp ->
            csharpGenerator.CreateDelegate(problem.Controller)
            |> Async.TryMapResult(fun controllerDelegate -> controllerDelegate(Generator(seed.Value)))
            |> Async.BindResult(fun result -> 
                viewFormatter.Format(result, problem.View)
                |> Async.MapResult(fun view -> (view, result))
            )
            |> Async.MapResult(fun (formattedView, result) ->
                {
                    GeneratedProblem.Id = Guid.NewGuid().ToString()
                    ProblemId = problem.Id.Value
                    Seed = seed.Value
                    Title = problem.Title.Value
                    View =
                        {
                            Code.Language = formattedView.Language.Name
                            Code.Content = formattedView.Content.Value
                        }
                    Answer = result.Answer
                }
            )

    interface IGeneratorService with
        member this.TestGenerate(problemId, seed) =
            problemsService.Get(problemId)
            |> Async.BindResult(fun problem -> this.CreateGeneratedProblem(problem, seed))
            |> Async.TryMapResult GeneratedProblemModel.Create

        member this.TestValidate(problemId, expected, actual) =
            problemsService.Get(problemId)
            |> Async.BindResult(fun problem ->
                match problem.Validator.Language.Language with
                | ValidatorLanguage.CSharp ->
                    csharpGenerator.CreateDelegate(problem.Validator)
                    |> Async.TryMapResult(fun validator ->
                        validator(Answer(actual.Value), Answer(expected.Value))
                    )
            )

        member this.Validate(generatedProblemId, problemAnswer) =
            (this :> IGeneratorService).Get(generatedProblemId)
            |> Async.BindResult(fun generatedProblem ->
                problemsService.Get(generatedProblem.ProblemId)
                |> Async.BindResult(fun problem ->
                    match problem.Validator.Language.Language with
                    | ValidatorLanguage.CSharp ->
                        csharpGenerator.CreateDelegate(problem.Validator)
                        |> Async.TryMapResult(fun validator ->
                            validator(Answer(problemAnswer.Value), Answer(generatedProblem.Answer.Value))
                        )
                )
            )

        member this.Get(id: GeneratedProblemId): Async<Result<GeneratedProblemModel, Exception>> =
            generatedProblemContext.Get(GeneratedProblem.CreateDocumentKey(id.Value))
            |> Async.TryMapResult GeneratedProblemModel.Create

        member this.Get(id: GeneratedProblemSetId): Async<Result<GeneratedProblemSetModel, Exception>> =
            generatedProblemSetContext.Get(GeneratedProblemSet.CreateDocumentKey(id.Value))
            |> Async.TryMapResult GeneratedProblemSetModel.Create

        member this.Generate(problemSetId: ProblemSetId): Async<Result<GeneratedProblemSetId, Exception>> =
            problemsService.Get(problemSetId)
            |> Async.BindResult(fun problemSet ->
                problemSet.Heads
                |> Seq.map versionControlService.Get
                |> ResultOfAsyncSeq
                |> Async.BindResult(fun heads ->
                    heads
                    |> Seq.map(fun head ->
                        match head.Commit.Target.ConcreteId with
                        | ConcreteId.Problem(problemId) ->
                            problemsService.Get(problemId)
                            |> Async.BindResult(fun problem ->
                                this.CreateGeneratedProblem(problem, ProblemSeed(random.Next()))
                            )
                        | _ -> async.Return(Error(InvalidOperationException("Invalid target type") :> Exception))
                    )
                    |> ResultOfAsyncSeq
                )
                |> Async.MapResult(fun generatedProblems -> (generatedProblems, problemSet))
            )
            |> Async.BindResult(fun (generatedProblems, problemSet) ->
                generatedProblems
                |> Seq.map(fun generatedProblem ->
                    generatedProblemContext.Insert(generatedProblem, generatedProblem)
                    |> Async.MapResult(fun _ -> GeneratedProblemId(generatedProblem.Id))
                )
                |> ResultOfAsyncSeq
                |> Async.MapResult(fun generatedProblemIds -> (generatedProblemIds, problemSet))
            )
            |> Async.BindResult(fun (generatedProblemIds, problemSet) ->
                let generatedProblemSet =
                    {
                        GeneratedProblemSet.Id = Guid.NewGuid().ToString()
                        Duration = Convert.ToInt32(problemSet.Duration.Value.TotalSeconds)
                        Problems =
                            generatedProblemIds
                            |> Seq.map(fun id -> id.Value)
                            |> List.ofSeq
                        Title = problemSet.Title.Value
                    }
                generatedProblemSetContext.Insert(generatedProblemSet, generatedProblemSet)
                |> Async.MapResult(fun _ -> GeneratedProblemSetId(generatedProblemSet.Id))
            )

        member this.Generate(problemId: ProblemId) =
            problemsService.Get(problemId)
            |> Async.BindResult(fun problem -> this.CreateGeneratedProblem(problem, ProblemSeed(random.Next())))
            |> Async.BindResult(fun generatedProblem ->
                generatedProblemContext.Insert(generatedProblem, generatedProblem)
                |> Async.MapResult(fun _ -> GeneratedProblemId(generatedProblem.Id))
            )