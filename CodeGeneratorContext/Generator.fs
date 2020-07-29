namespace CodeGeneratorContext

open System
open System.Collections.Generic

type ControllerResult() =
    let mutable answer = ""
    let mutable parameters = Dictionary<string, string>()

    member this.Answer
        with get() = answer and set(v: string) = answer <- v

    member val Parameters = (parameters :> IReadOnlyDictionary<string, string>) with get

    member this.AddParameter(name: string, value: obj) : unit =
        parameters.Add(name, value.ToString())
        ()

type Generator(seed: int32) =
    let random = Random(seed)

    member this.GetInt(minInclusive: int32, maxExclusive: int32) =
        random.Next(minInclusive, maxExclusive)

    member this.Сhoose<'T>([<ParamArray>] obj: 'T[]) =
        obj.[random.Next(obj.Length)]

type Answer(ans: string) =
    member val Value = ans with get
