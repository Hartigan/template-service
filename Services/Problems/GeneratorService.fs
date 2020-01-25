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

    member this.CreateGeneratedProblem(problem: ProblemModel): Async<Result<GeneratedProblem, GenerateFail>> =
        async {
            match problem.Controller.Language.Language with
            | ControllerLanguage.CSharp ->
                let! generatorResult = csharpGenerator.CreateDelegate(problem.Controller)
                match generatorResult with
                | Result.Error(fail) -> return Result.Error(fail)
                | Result.Ok(controllerDelegate) ->
                    let seed = random.Next()
                    let controllerResult = controllerDelegate.Invoke(Generator(seed))
                    match! viewFormatter.Format(controllerResult, problem.View) with
                    | Result.Error(fail) -> return Result.Error(fail)
                    | Result.Ok(formattedView) ->
                        return Ok
                                   ({ GeneratedProblem.Id = Guid.NewGuid().ToString()
                                      ProblemId = problem.Id.Value
                                      Seed = seed
                                      Title = problem.Title.Value
                                      View =
                                          { Code.Language = formattedView.Language.Name
                                            Code.Content = formattedView.Content.Value }
                                      Answer = controllerResult.Answer })
        }

    interface IGeneratorService with
        member this.Validate(generatedProblemId, problemAnswer) =
            async {
                match! (this :> IGeneratorService).Get(generatedProblemId) with
                | Result.Error(fail) ->
                    match fail with
                    | Services.Problems.GetFail.Error(error) -> return Result.Error(GenerateFail.Error(error))
                | Ok(generatedProblem) ->
                    match! problemsService.Get(generatedProblem.ProblemId) with
                    | Result.Error(fail) ->
                        match fail with
                        | Services.Problems.GetFail.Error(error) -> return Result.Error(GenerateFail.Error(error))
                    | Ok(problem) ->
                        match problem.Validator.Language.Language with
                        | ValidatorLanguage.CSharp ->
                            match! csharpGenerator.CreateDelegate(problem.Validator) with
                            | Result.Error(fail) -> return Result.Error(fail)
                            | Ok(validator) ->
                                return Ok(validator.Invoke(Answer(problemAnswer.Value), Answer(generatedProblem.Answer.Value)))
            }

        member this.Get(id: GeneratedProblemId): Async<Result<GeneratedProblemModel, Services.Problems.GetFail>> =
            async {
                match! generatedProblemContext.Get(GeneratedProblem.CreateDocumentKey(id.Value)) with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) -> return Result.Error(Services.Problems.GetFail.Error(error))
                | Result.Ok(entity) ->
                    match GeneratedProblemModel.Create(entity) with
                    | Result.Error() -> return Result.Error(Services.Problems.GetFail.Error(InvalidOperationException("Cannot create GeneratedProblemModel")))
                    | Ok(model) -> return Ok(model)
            }

        member this.Get(id: GeneratedProblemSetId): Async<Result<GeneratedProblemSetModel, Services.Problems.GetFail>> =
            async {
                match! generatedProblemSetContext.Get(GeneratedProblemSet.CreateDocumentKey(id.Value)) with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) -> return Result.Error(Services.Problems.GetFail.Error(error))
                | Result.Ok(entity) ->
                    match GeneratedProblemSetModel.Create(entity) with
                    | Result.Error() -> return Result.Error(Services.Problems.GetFail.Error(InvalidOperationException("Cannot create GeneratedProblemSetModel")))
                    | Ok(model) -> return Ok(model)
            }

        member this.Generate(problemSetId: ProblemSetId): Async<Result<GeneratedProblemSetId, GenerateFail>> =
            async {
                match! problemsService.Get(problemSetId) with
                | Result.Error(fail) ->
                    match fail with
                    | Services.Problems.GetFail.Error(error) -> return Result.Error(GenerateFail.Error(error))
                | Ok(problemSet) ->
                    let! generatedProblems = 
                        problemSet.Heads
                        |> Seq.map(fun headId ->
                            async {
                                match! versionControlService.Get(headId) with
                                | Result.Error(fail) ->
                                    match fail with
                                    | GetFail.Error(error) -> return Result.Error(GenerateFail.Error(error))
                                | Ok(head) ->
                                    match head.Commit.Target.ConcreteId with
                                    | ConcreteId.Problem(problemId) ->
                                        match! problemsService.Get(problemId) with
                                        | Result.Error(fail) ->
                                            match fail with
                                            | Services.Problems.GetFail.Error(error) -> return Result.Error(GenerateFail.Error(error))
                                        | Result.Ok(problem) ->
                                            match! this.CreateGeneratedProblem(problem) with
                                            | Result.Error(fail) -> return Result.Error(fail)
                                            | Ok(generatedProblem) -> return Result.Ok(generatedProblem)
                                    | _ -> return Result.Error(GenerateFail.Error(InvalidOperationException("Invalid target type")))
                            })
                        |> Async.Parallel

                    if (generatedProblems |> Seq.exists(fun x -> match x with | Ok(generatedProblem) -> false | _ -> true)) then
                        return Result.Error(GenerateFail.Error(InvalidOperationException("Cannot generate some problems")))
                    else
                        let! insertResults = 
                            generatedProblems
                            |> Seq.map(fun res ->
                                async {
                                    match res with
                                    | Result.Error(fail) -> return Result.Error(fail)
                                    | Result.Ok(generatedProblem) ->
                                        match! generatedProblemContext.Insert(generatedProblem, generatedProblem) with
                                        | Result.Error(fail) ->
                                            match fail with
                                            | InsertDocumentFail.Error(error) -> return Result.Error(GenerateFail.Error(error))
                                        | Result.Ok() -> return Result.Ok(GeneratedProblemId(generatedProblem.Id))
                                }) |> Async.Parallel

                        if insertResults |> Seq.exists(fun x -> match x with | Ok(generatedProblemId) -> false | _ -> true) then
                            return Result.Error(GenerateFail.Error(InvalidOperationException("Cannot insert some generated problems")))
                        else
                            let generatedProblemIds =
                                insertResults
                                |> Seq.map(fun res ->
                                    match res with
                                    | Result.Error(fail) -> []
                                    | Result.Ok(id) -> [ id.Value ])
                                |> List.concat
                                |> fun x -> x.ToList()
                            let generatedProblemSet = {
                                GeneratedProblemSet.Id = Guid.NewGuid().ToString()
                                Duration = Convert.ToInt32(problemSet.Duration.Value.TotalSeconds)
                                Problems = generatedProblemIds
                                Title = problemSet.Title.Value
                            }
                            match! generatedProblemSetContext.Insert(generatedProblemSet, generatedProblemSet) with
                            | Result.Error(fail) ->
                                match fail with
                                | InsertDocumentFail.Error(error) -> return Result.Error(GenerateFail.Error(error))
                            | Result.Ok() -> return Ok(GeneratedProblemSetId(generatedProblemSet.Id))
            }

        member this.Generate(problemId: ProblemId) =
            async {
                match! problemsService.Get(problemId) with
                | Result.Error(fail) ->
                    match fail with
                    | Services.Problems.GetFail.Error(error) -> return Result.Error(GenerateFail.Error(error))
                | Ok(problem) ->
                    match! this.CreateGeneratedProblem(problem) with
                    | Result.Error(fail) -> return Result.Error(fail)
                    | Ok(generatedProblem) ->
                        match! generatedProblemContext.Insert(generatedProblem, generatedProblem) with
                        | Result.Error(fail) ->
                            match fail with
                            | InsertDocumentFail.Error(error) -> return Result.Error(GenerateFail.Error(error))
                        | Result.Ok() -> return Ok(GeneratedProblemId(generatedProblem.Id))
            }