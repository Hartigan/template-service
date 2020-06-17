namespace Utils

open FSharp.Control
open FSharpx.Control

module ResultHelper =
    open System

    let ErrorOf2 (r: Result<'a, Exception> * Result<'b, Exception>) =
        match r with
        | (Ok(_), Result.Error(ex)) -> ex
        | (Result.Error(ex), Ok(_)) -> ex
        | (Result.Error(lex), Result.Error(rex)) -> AggregateException(lex, rex) :> Exception
        | _ -> ArgumentException("Result is Ok") :> Exception

    let ErrorOf3 (r: Result<'a, Exception> * Result<'b, Exception> * Result<'c, Exception>)  =
        match r with
        | (Result.Error(ex1), Result.Error(ex2), Result.Error(ex3)) -> AggregateException(ex1, ex2, ex3) :> Exception
        | (Result.Error(ex1), Result.Error(ex2), Ok(_)) -> AggregateException(ex1, ex2) :> Exception
        | (Result.Error(ex1), Ok(_), Result.Error(ex3)) -> AggregateException(ex1, ex3) :> Exception
        | (Ok(_), Result.Error(ex2), Result.Error(ex3)) -> AggregateException(ex2, ex3) :> Exception
        | (Result.Error(ex), Ok(_), Ok(_)) -> ex
        | (Ok(_), Result.Error(ex), Ok(_)) -> ex
        | (Ok(_), Ok(_), Result.Error(ex)) -> ex
        | _ -> ArgumentException("Result is Ok") :> Exception

    let ResultOfSeq s =
        s
        |> Seq.map(fun x ->
            match x with
            | Ok(ok) -> Ok([ ok ])
            | Result.Error(error) -> Result.Error([ error ])
        )
        |> Seq.fold (fun r x ->
            match (r, x) with
            | (Ok(l), Ok(r)) -> Ok(l @ r)
            | (Result.Error(ex), Ok(r)) -> Result.Error(ex)
            | (Ok(l), Result.Error(ex)) -> Result.Error(ex)
            | (Result.Error(lex), Result.Error(rex)) -> Result.Error(lex @ rex)
        ) (Ok([]))
        |> fun x ->
            match x with
            | Ok(list) -> Ok(list)
            | Result.Error(exList) -> Result.Error(AggregateException(exList) :> Exception)

    let ResultOfAsyncSeq s =
        s
        |> Async.Parallel
        |> Async.map ResultOfSeq

    type Microsoft.FSharp.Control.Async with
        static member TryMapResult f ar = 
            async {
                match! ar with
                | Ok(x) ->
                    match f(x) with
                    | Ok(r) -> return Ok(r)
                    | Result.Error(error) -> return Result.Error(error)
                | Result.Error(error) -> return Result.Error(error)
            }

        static member MapResult f ar = 
            async {
                match! ar with
                | Ok(x) -> return Ok(f(x))
                | Result.Error(error) -> return Result.Error(error)
            }

        static member BindResult f ar =
            async {
                match! ar with
                | Ok(x) -> return! f(x)
                | Result.Error(error) -> return Result.Error(error)
            }

        static member MapResultAsync f ar =
            async {
                match! ar with
                | Ok(x) ->
                    let! result = f(x)
                    return Ok(result)
                | Result.Error(error) -> return Result.Error(error)
            }

        static member Bind f ar =
            async {
                let! result = ar
                return! f(result)
            }

        static member Map f ar =
            async {
                let! result = ar
                return f(result)
            }


