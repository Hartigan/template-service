namespace CSharpGenerator

open System
open Utils.AsyncHelper
open System.Threading.Tasks
open CodeGeneratorContext
open Microsoft.CodeAnalysis
open Microsoft.CodeAnalysis.CSharp.Scripting
open Microsoft.CodeAnalysis.Scripting

type CSharpGenerator() =
    let location = typeof<Generator>.Assembly.Location
    let metadata = MetadataReference.CreateFromFile(location)
    let templateController = 
        "System.Func<CodeGeneratorContext.Generator, CodeGeneratorContext.ControllerResult> fn = (CodeGeneratorContext.Generator generator) =>\n" +
        "{{\n" +
        "    CodeGeneratorContext.ControllerResult result = new CodeGeneratorContext.ControllerResult();\n" + 
        "{0}\n" +
        "    return result;\n"+
        "}};\n"

    let templateValidator = 
        "System.Func<CodeGeneratorContext.Answer, CodeGeneratorContext.Answer, bool> fn = (CodeGeneratorContext.Answer actual, CodeGeneratorContext.Answer expected) =>\n" +
        "{{\n" +
        "    bool result = false;\n" + 
        "{0}\n" +
        "    return result;\n"+
        "}};\n"


    member this.CreateGeneratorDelegate(code: string) =
        async {
            try
                let program = String.Format(templateController, code)
                let! (state : ScriptState<obj>) = CSharpScript.RunAsync(program, ScriptOptions.Default.WithReferences(metadata))
                let fn = (state.GetVariable("fn").Value :?> Func<Generator, ControllerResult>)
                return Ok(fun (generator: Generator) ->
                    try
                        Ok(fn.Invoke(generator))
                    with ex -> Error(ex)

                )
            with ex -> return Error(ex)
        }

    member this.CreateValidatorDelegate(code: string) =
        async {
            try
                let program = String.Format(templateValidator, code)
                let! (state : ScriptState<obj>) = CSharpScript.RunAsync(program, ScriptOptions.Default.WithReferences(metadata))
                let fn = (state.GetVariable("fn").Value :?> Func<Answer, Answer, bool>)
                return Ok(fun (actual: Answer, expected: Answer) ->
                    try
                        Ok(fn.Invoke(actual, expected))
                    with ex -> Error(ex)

                )
            with ex -> return Error(ex)
        }