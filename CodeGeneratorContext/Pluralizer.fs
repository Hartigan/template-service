namespace CodeGeneratorContext

open System
open System.Collections.Generic

type RussianPluralizer() =
    member this.Pluralize(n: int, form1: string, form2: string, form5: string) =
        let n100 = Math.Abs(n) % 100
        match (n100, n100 % 10) with
        | x, _ when x > 10 && x < 20 -> form5
        | _, 1 -> form1
        | _, x when x > 1 && x < 5 -> form2
        | _ -> form5

type Pluralizer() =
    member val Russian = RussianPluralizer() with get