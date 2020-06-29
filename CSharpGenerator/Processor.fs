namespace CSharpGenerator

open Microsoft.Extensions.Caching.Memory
open CodeGeneratorContext
open Utils.AsyncHelper
open System
open System.Threading.Tasks
open Microsoft.Extensions.Logging

type Processor(generator: CSharpGenerator,
               cache: IMemoryCache,
               logger: ILogger<Processor>
               ) =

    member private this.CreateGeneratorBuilder(code: string) =
        let func = Func<ICacheEntry, Task<(Generator -> Result<ControllerResult, Exception>)>>(fun entry ->
                    async {
                        match! generator.CreateGeneratorDelegate(code) with
                        | Ok(dataGenerator) -> return dataGenerator
                        | Error(ex) -> 
                            logger.LogError(ex, "Cannot compile problem controller")
                            return raise<(Generator -> Result<ControllerResult, Exception>)>(ex)
                    }
                    |> Async.StartAsTask
            )
        func

    member private this.CreateValidatorBuilder(code: string) =
        let func = Func<ICacheEntry, Task<(Answer * Answer -> Result<bool, Exception>)>>(fun entry ->
                    async {
                        match! generator.CreateValidatorDelegate(code) with
                        | Ok(dataValidator) -> return dataValidator
                        | Error(ex) -> 
                            logger.LogError(ex, "Cannot compile problem validator")
                            return raise<(Answer * Answer -> Result<bool, Exception>)>(ex)
                    }
                    |> Async.StartAsTask
            )
        func

    member private this.CreateGeneratorId(rawId: string) =
        rawId + "_generator"
    
    member private this.CreateValidatorId(rawId: string) =
        rawId + "_validator"

    member this.Generate(req: GenerateProblemDataRequest) =
        async {
            let generatorId = this.CreateGeneratorId(req.ProblemId)
            let! (dataGenerator: Generator -> Result<ControllerResult, Exception>) = cache.GetOrCreateAsync(generatorId, this.CreateGeneratorBuilder(req.Code))
            cache.Set(generatorId, dataGenerator)
            let g = Generator(req.Seed)

            match dataGenerator(g) with
            | Ok(result) ->
                return Ok({
                    Answer = result.Answer
                    Parameters =
                        result.Parameters
                        |> Seq.map(fun entry ->
                            {
                                Name = entry.Key
                                Value = entry.Value
                            }
                        )
                        |> List.ofSeq
                })
            | Error(ex) -> return Error(ex)
        }

    member this.Validate(req: ValidateProblemAnswerRequest) =
        async {
            let validatorId = this.CreateValidatorId(req.ProblemId)
            let! (dataValidator: Answer * Answer -> Result<bool, Exception>) = cache.GetOrCreateAsync(validatorId, this.CreateValidatorBuilder(req.Code))
            cache.Set(validatorId, dataValidator)

            match dataValidator(Answer(req.Actual), Answer(req.Expected)) with
            | Ok(isCorrect) ->
                return Ok({
                    IsCorrect = isCorrect
                })
            | Error(ex) -> return Error(ex)
        }

