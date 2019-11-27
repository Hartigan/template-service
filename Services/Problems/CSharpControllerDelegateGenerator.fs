namespace Services.Problems

open System
open Utils.AsyncHelper
open System.Threading.Tasks
open CodeGeneratorContext
open Microsoft.CodeAnalysis
open Microsoft.CodeAnalysis.CSharp.Scripting
open Microsoft.CodeAnalysis.Scripting

type CSharpControllerDelegateGenerator() =
    let location = typeof<Generator>.Assembly.Location
    let metadata = MetadataReference.CreateFromFile(location)
    let template = 
        "System.Func<CodeGeneratorContext.Generator, CodeGeneratorContext.ControllerResult> fn = (CodeGeneratorContext.Generator generator) =>\n" +
        "{{\n" +
        "    CodeGeneratorContext.ControllerResult result = new CodeGeneratorContext.ControllerResult();\n" + 
        "{0}\n" +
        "    return result;\n"+
        "}}\n"


    interface IControllerDelegateGenerator with
        member this.CreateDelegate(model) =
            async {
                try
                    let! (state : ScriptState<obj>) = CSharpScript.RunAsync(String.Format(template, model.Content.Value), ScriptOptions.Default.WithReferences(metadata))
                    let fn = (state.GetVariable("fn").Value :?> Func<Generator, ControllerResult>)
                    return Result.Ok(fn)
                with ex -> return Result.Error(GenerateFail.Error(ex))
            }