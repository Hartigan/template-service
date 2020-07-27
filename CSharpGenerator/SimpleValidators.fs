namespace CSharpGenerator

open System.Text.Json.Serialization
open System

type ISimpleValidator<'T> =
    abstract member Validate : string * string * 'T -> bool

type FloatValidatorOptions =
    {
        [<JsonPropertyName("epsilon")>]
        Epsilon: float
    }

type FloatValidator() =
    interface ISimpleValidator<FloatValidatorOptions> with
        member this.Validate(expected, actual, options) =
            let mutable expectedFloat = 0.0
            let mutable actualFloat = 0.0
            match (Double.TryParse(expected.Trim(), &expectedFloat), Double.TryParse(actual.Trim(), &actualFloat)) with
            | (true, true) -> Math.Abs(expectedFloat - actualFloat) < options.Epsilon
            | _ -> false

type IntValidatorOptions =
    {
        [<JsonPropertyName("base")>]
        Base: int
    }

type IntValidator() =
    interface ISimpleValidator<IntValidatorOptions> with
        member this.Validate(expected, actual, options) =
            Convert.ToInt32(expected.Trim(), options.Base) = Convert.ToInt32(actual.Trim(), options.Base)

type StringValidatorOptions =
    {
        [<JsonPropertyName("ignore_case")>]
        IgnoreCase: bool
        [<JsonPropertyName("trim")>]
        Trim: bool
    }

type StringValidator() =
    interface ISimpleValidator<StringValidatorOptions> with
        member this.Validate(expected, actual, options) =
            let (normExpected, normActual) =
                if options.Trim then
                    (expected.Trim(), actual.Trim())
                else
                    (expected, actual)
            let strComparsion =
                if options.IgnoreCase then
                    StringComparison.OrdinalIgnoreCase
                else
                    StringComparison.Ordinal
            
            String.Equals(normExpected, normActual, strComparsion)
