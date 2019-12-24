namespace Services.Problems

open System
open System.Text.RegularExpressions
open System.Collections.Generic
open Models.Problems
open Models.Code

type ViewFormatter() =
    let validateName = Regex("[A-Za-z0-9\\-_]+")

    interface IViewFormatter with
        member this.Format(controllerResult, modelView) =
            async {
                let format(enumerator: IEnumerator<KeyValuePair<string, string>>, source: string) =
                    if enumerator.MoveNext() then
                        let current = enumerator.Current
                        if validateName.IsMatch(current.Key) then
                            let parameterFinder = Regex("\\{\\{" + Regex.Escape(current.Key) + "\\}\\}")
                            Result.Ok(parameterFinder.Replace(source, current.Value))
                        else
                            Result.Error(GenerateFail.Error(InvalidOperationException(sprintf "Invalid parameter name format: %s" current.Key)))
                    else
                        Result.Ok(source)

                let parametersEnumerator = (controllerResult.Parameters :> IEnumerable<KeyValuePair<string, string>>).GetEnumerator()
                let formatResult = format(parametersEnumerator, modelView.Content.Value)

                match formatResult with
                | Result.Ok(contentString) -> return Result.Ok(GeneratedViewModel.Create(modelView, ContentModel(contentString)))
                | Result.Error(fail) -> return Result.Error(fail)
            }