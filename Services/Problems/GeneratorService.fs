namespace Services.Problems

open System
open DatabaseTypes
open Models.Problems
open Contexts
open Services.VersionControl
open DatabaseTypes.Identificators
open Models.Heads
open Utils.ResultHelper
open System.Net.Http
open System.Text.Json.Serialization
open Models.Code
open Microsoft.Extensions.Options

module Async = 
    let flatMap f x = async.Bind(x, f)

type GeneratorService(viewFormatter: IViewFormatter,
                      generatedProblemContext: IContext<GeneratedProblem>,
                      generatedProblemSetContext: IContext<GeneratedProblemSet>,
                      problemsService: IProblemsService,
                      versionControlService: IVersionControlService,
                      clientFactory: IHttpClientFactory,
                      generatorsOptions: IOptions<GeneratorsOptions>) =

    let csharpConnector = GeneratorConnector(generatorsOptions.Value.CSharp.Endpoint, clientFactory)
    let random = Random(0)


    member this.CreateGeneratedProblem(problem: ProblemModel, seed: ProblemSeed): Async<Result<GeneratedProblem, Exception>> =
        match problem.Controller.Language.Language with
        | ControllerLanguage.CSharp ->
            csharpConnector.Generate(problem, seed)
            |> Async.BindResult(fun result -> 
                viewFormatter.Format(result.Parameters, problem.View)
                |> Async.MapResult(fun view -> (view, result))
            )
            |> Async.MapResult(fun (formattedView, result) ->
                {
                    GeneratedProblem.Id = GeneratedProblemId(Guid.NewGuid().ToString())
                    Type = GeneratedProblemType.Instance
                    ProblemId = problem.Id
                    Seed = seed.Value
                    Title = problem.Title.Value
                    View =
                        {
                            Code.Language = formattedView.Language.Name
                            Code.Content = formattedView.Content.Value
                        }
                    Answer = result.Answer.Value
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
                    csharpConnector.Validate(problem, actual, expected)
                    |> Async.MapResult(fun result -> result.IsCorrect)
            )

        member this.Validate(generatedProblemId, problemAnswer) =
            (this :> IGeneratorService).Get(generatedProblemId)
            |> Async.BindResult(fun generatedProblem ->
                problemsService.Get(generatedProblem.ProblemId)
                |> Async.BindResult(fun problem ->
                    match problem.Validator.Language.Language with
                    | ValidatorLanguage.CSharp ->
                        csharpConnector.Validate(problem, problemAnswer, generatedProblem.Answer)
                        |> Async.MapResult(fun result -> result.IsCorrect)
                )
            )

        member this.Get(id: GeneratedProblemId): Async<Result<GeneratedProblemModel, Exception>> =
            generatedProblemContext.Get(GeneratedProblem.CreateDocumentKey(id))
            |> Async.TryMapResult GeneratedProblemModel.Create

        member this.Get(id: GeneratedProblemSetId): Async<Result<GeneratedProblemSetModel, Exception>> =
            generatedProblemSetContext.Get(GeneratedProblemSet.CreateDocumentKey(id))
            |> Async.TryMapResult GeneratedProblemSetModel.Create

        member this.Generate(problemSetId: ProblemSetId): Async<Result<GeneratedProblemSetId, Exception>> =
            let seed = random.Next()
            let rnd = Random(seed)
            problemsService.Get(problemSetId)
            |> Async.BindResult(fun problemSet ->
                problemSet.Slots
                |> Seq.choose(fun slot ->
                    if slot.Heads.IsEmpty then
                        None
                    else
                        let index = rnd.Next(0, slot.Heads.Length)
                        Some(slot.Heads.Item(index))
                )
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
                    |> Async.MapResult(fun _ -> generatedProblem.Id)
                )
                |> ResultOfAsyncSeq
                |> Async.MapResult(fun generatedProblemIds -> (generatedProblemIds, problemSet))
            )
            |> Async.BindResult(fun (generatedProblemIds, problemSet) ->
                let generatedProblemSet =
                    {
                        GeneratedProblemSet.Id = GeneratedProblemSetId(Guid.NewGuid().ToString())
                        Seed = seed
                        Type = GeneratedProblemSetType.Instance
                        Duration = Convert.ToInt32(problemSet.Duration.Value.TotalSeconds)
                        Problems = generatedProblemIds
                        Title = problemSet.Title.Value
                    }
                generatedProblemSetContext.Insert(generatedProblemSet, generatedProblemSet)
                |> Async.MapResult(fun _ -> generatedProblemSet.Id)
            )

        member this.Generate(problemId: ProblemId) =
            problemsService.Get(problemId)
            |> Async.BindResult(fun problem -> this.CreateGeneratedProblem(problem, ProblemSeed(random.Next())))
            |> Async.BindResult(fun generatedProblem ->
                generatedProblemContext.Insert(generatedProblem, generatedProblem)
                |> Async.MapResult(fun _ -> generatedProblem.Id)
            )