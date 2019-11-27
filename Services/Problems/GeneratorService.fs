namespace Services.Problems

open System
open DatabaseTypes
open Models.Problems
open Contexts
open CodeGeneratorContext

type GeneratorService(viewFormatter: IViewFormatter, generatedProblemContext: GeneratedProblemContext) =

    let csharpControllerGenerator = (CSharpControllerDelegateGenerator() :> IControllerDelegateGenerator)
    let generatedProblemContext = (generatedProblemContext :> IContext<GeneratedProblem>)
    let random = Random(0)

    interface IGeneratorService with
        member this.GenerateProblem(problem) =
            async {
                match problem.Controller.Language.Language with
                | ControllerLanguage.CSharp ->
                    let! generatorResult = csharpControllerGenerator.CreateDelegate(problem.Controller)
                    match generatorResult with
                    | Result.Error(fail) -> return Result.Error(fail)
                    | Result.Ok(controllerDelegate) ->
                        let seed = random.Next()
                        let controllerResult = controllerDelegate.Invoke(Generator(seed))
                        match! viewFormatter.Format(controllerResult, problem.View) with
                        | Result.Error(fail) -> return Result.Error(fail)
                        | Result.Ok(formattedView) -> 
                            let generatedProblem = {
                                GeneratedProblem.Id = Guid.NewGuid().ToString()
                                ProblemId = problem.Id.Value
                                Seed = seed
                                Title = problem.Title.Value
                                View = {
                                    Code.Language = formattedView.Language.Name
                                    Code.Content = formattedView.Content.Value
                                }
                                Answer = controllerResult.Answer
                            }
                            match GeneratedProblemModel.Create(generatedProblem) with
                            | Result.Ok(generatedProblemModel) -> return Result.Ok(generatedProblemModel)
                            | Result.Error() -> return Result.Error(GenerateFail.Error(InvalidOperationException("Cannot create GeneratedProblemModel")))
            }