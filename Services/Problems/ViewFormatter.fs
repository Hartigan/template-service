namespace Services.Problems

open System
open System.Text.RegularExpressions
open Models.Problems
open Models.Code

type ViewFormatter() =
    let validateName = Regex("[A-Za-z0-9\\-_]+")

    interface IViewFormatter with
        member this.Format(parameters, modelView) =
            let rec format(items: List<ProblemParameter>, source: string) : Result<string, Exception> =
                match items with
                | [] -> Ok(source)
                | head::tail ->
                    if validateName.IsMatch(head.Name) then
                        let parameterFinder = Regex("\\{\\{" + Regex.Escape(head.Name) + "\\}\\}")
                        format(tail, parameterFinder.Replace(source, head.Value))
                    else
                        Error(InvalidOperationException(sprintf "Invalid parameter name format: %s" head.Name) :> Exception)

            let formatResult = format(parameters, modelView.Content.Value)

            match formatResult with
            | Ok(contentString) -> async.Return(Ok(GeneratedViewModel.Create(modelView, ContentModel(contentString))))
            | Error(fail) -> async.Return(Error(fail))