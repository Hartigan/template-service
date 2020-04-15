namespace Utils

module ResultHelper =
    open System

    let ErrorOf2 (r: Result<'a, Exception> * Result<'b, Exception>) =
        match r with
        | (Ok(_), Error(ex)) -> ex
        | (Error(ex), Ok(_)) -> ex
        | (Error(lex), Error(rex)) -> AggregateException(lex, rex) :> Exception
        | _ -> ArgumentException("Result is Ok") :> Exception

    let ErrorOf3 (r: Result<'a, Exception> * Result<'b, Exception> * Result<'c, Exception>)  =
        match r with
        | (Error(ex1), Error(ex2), Error(ex3)) -> AggregateException(ex1, ex2, ex3) :> Exception
        | (Error(ex1), Error(ex2), Ok(_)) -> AggregateException(ex1, ex2) :> Exception
        | (Error(ex1), Ok(_), Error(ex3)) -> AggregateException(ex1, ex3) :> Exception
        | (Ok(_), Error(ex2), Error(ex3)) -> AggregateException(ex2, ex3) :> Exception
        | (Error(ex), Ok(_), Ok(_)) -> ex
        | (Ok(_), Error(ex), Ok(_)) -> ex
        | (Ok(_), Ok(_), Error(ex)) -> ex
        | _ -> ArgumentException("Result is Ok") :> Exception

    let ResultOfSeq s =
        s
        |> Seq.map(fun x ->
            match x with
            | Ok(ok) -> Ok([ ok ])
            | Error(error) -> Error([ error ])
        )
        |> Seq.fold (fun r x ->
            match (r, x) with
            | (Ok(l), Ok(r)) -> Ok(l @ r)
            | (Error(ex), Ok(r)) -> Error(ex)
            | (Ok(l), Error(ex)) -> Error(ex)
            | (Error(lex), Error(rex)) -> Error(lex @ rex)
        ) (Ok([]))
        |> fun x ->
            match x with
            | Ok(list) -> Ok(list)
            | Error(exList) -> Error(AggregateException(exList) :> Exception)