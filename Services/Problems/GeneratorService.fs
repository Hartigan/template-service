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
        async {
            match problem.Controller.Language.Language with
            | ControllerLanguage.CSharp ->
                let! generatorResult = csharpGenerator.CreateDelegate(problem.Controller)
                match generatorResult with
                | Error(ex) -> return Error(ex)
                | Ok(controllerDelegate) ->
                    let controllerResult = controllerDelegate(Generator(seed.Value))
                    match controllerResult with
                    | Error(ex) -> return Error(ex)
                    | Ok(result) ->
                        match! viewFormatter.Format(result, problem.View) with
                        | Error(ex) -> return Error(ex)
                        | Ok(formattedView) ->
                            return Ok
                               ({ GeneratedProblem.Id = Guid.NewGuid().ToString()
                                  ProblemId = problem.Id.Value
                                  Seed = seed.Value
                                  Title = problem.Title.Value
                                  View =
                                      { Code.Language = formattedView.Language.Name
                                        Code.Content = formattedView.Content.Value }
                                  Answer = result.Answer })
        }

    interface IGeneratorService with
        member this.TestGenerate(problemId, seed) =
            async {
                match! problemsService.Get(problemId) with
                | Error(ex) -> return Error(ex)
                | Ok(problem) ->
                    match! this.CreateGeneratedProblem(problem, seed) with
                    | Error(ex) -> return Error(ex)
                    | Ok(generatedProblem) -> return GeneratedProblemModel.Create(generatedProblem)
            }

        member this.TestValidate(problemId, expected, actual) =
            async {
                match! problemsService.Get(problemId) with
                | Error(ex) -> return Error(ex)
                | Ok(problem) ->
                    match problem.Validator.Language.Language with
                    | ValidatorLanguage.CSharp ->
                        match! csharpGenerator.CreateDelegate(problem.Validator) with
                        | Error(ex) -> return Error(ex)
                        | Ok(validator) ->
                            return validator(Answer(actual.Value), Answer(expected.Value))
            }

        member this.Validate(generatedProblemId, problemAnswer) =
            async {
                match! (this :> IGeneratorService).Get(generatedProblemId) with
                | Error(ex) -> return Error(ex)
                | Ok(generatedProblem) ->
                    match! problemsService.Get(generatedProblem.ProblemId) with
                    | Error(ex) -> return Error(ex)
                    | Ok(problem) ->
                        match problem.Validator.Language.Language with
                        | ValidatorLanguage.CSharp ->
                            match! csharpGenerator.CreateDelegate(problem.Validator) with
                            | Error(ex) -> return Error(ex)
                            | Ok(validator) ->
                                return validator(Answer(problemAnswer.Value), Answer(generatedProblem.Answer.Value))
            }

        member this.Get(id: GeneratedProblemId): Async<Result<GeneratedProblemModel, Exception>> =
            async {
                match! generatedProblemContext.Get(GeneratedProblem.CreateDocumentKey(id.Value)) with
                | Error(ex) -> return Error(ex)
                | Ok(entity) -> return GeneratedProblemModel.Create(entity)
            }

        member this.Get(id: GeneratedProblemSetId): Async<Result<GeneratedProblemSetModel, Exception>> =
            async {
                match! generatedProblemSetContext.Get(GeneratedProblemSet.CreateDocumentKey(id.Value)) with
                | Error(ex) -> return Error(ex)
                | Ok(entity) -> return GeneratedProblemSetModel.Create(entity)
            }

        member this.Generate(problemSetId: ProblemSetId): Async<Result<GeneratedProblemSetId, Exception>> =
            async {
                match! problemsService.Get(problemSetId) with
                | Error(ex) -> return Error(ex)
                | Ok(problemSet) ->
                    let! generatedProblems = 
                        problemSet.Heads
                        |> Seq.map(fun headId ->
                            async {
                                match! versionControlService.Get(headId) with
                                | Error(ex) -> return Error(ex)
                                | Ok(head) ->
                                    match head.Commit.Target.ConcreteId with
                                    | ConcreteId.Problem(problemId) ->
                                        match! problemsService.Get(problemId) with
                                        | Error(ex) -> return Error(ex)
                                        | Ok(problem) -> return! this.CreateGeneratedProblem(problem, ProblemSeed(random.Next()))
                                    | _ -> return Error(InvalidOperationException("Invalid target type") :> Exception)
                            })
                        |> Async.Parallel

                    if (generatedProblems |> Seq.exists(fun x -> match x with | Ok(generatedProblem) -> false | _ -> true)) then
                        return Error(InvalidOperationException("Cannot generate some problems") :> Exception)
                    else
                        let! insertResults = 
                            generatedProblems
                            |> Seq.map(fun res ->
                                async {
                                    match res with
                                    | Error(ex) -> return Error(ex)
                                    | Ok(generatedProblem) ->
                                        match! generatedProblemContext.Insert(generatedProblem, generatedProblem) with
                                        | Error(ex) -> return Error(ex)
                                        | Ok() -> return Ok(GeneratedProblemId(generatedProblem.Id))
                                }) |> Async.Parallel

                        if insertResults |> Seq.exists(fun x -> match x with | Ok(generatedProblemId) -> false | _ -> true) then
                            return Error(InvalidOperationException("Cannot insert some generated problems") :> Exception)
                        else
                            let generatedProblemIds =
                                insertResults
                                |> Seq.map(fun res ->
                                    match res with
                                    | Error(ex) -> []
                                    | Ok(id) -> [ id.Value ])
                                |> List.concat
                                |> fun x -> x.ToList()
                            let generatedProblemSet = {
                                GeneratedProblemSet.Id = Guid.NewGuid().ToString()
                                Duration = Convert.ToInt32(problemSet.Duration.Value.TotalSeconds)
                                Problems = generatedProblemIds
                                Title = problemSet.Title.Value
                            }
                            match! generatedProblemSetContext.Insert(generatedProblemSet, generatedProblemSet) with
                            | Error(ex) -> return Error(ex)
                            | Ok() -> return Ok(GeneratedProblemSetId(generatedProblemSet.Id))
            }

        member this.Generate(problemId: ProblemId) =
            async {
                match! problemsService.Get(problemId) with
                | Error(ex) -> return Error(ex)
                | Ok(problem) ->
                    match! this.CreateGeneratedProblem(problem, ProblemSeed(random.Next())) with
                    | Error(ex) -> return Error(ex)
                    | Ok(generatedProblem) ->
                        match! generatedProblemContext.Insert(generatedProblem, generatedProblem) with
                        | Error(ex) -> return Error(ex)
                        | Ok() -> return Ok(GeneratedProblemId(generatedProblem.Id))
            }