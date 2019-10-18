namespace Utils

open System
open System.Linq
open Microsoft.FSharp.Quotations.Patterns
open System.Runtime.Serialization

module ReflectionHelper =
    let GetDataMemberName expr = 
        match expr with
        | PropertyGet(_, propertyInfo, _) ->
            let dataMemberAttribute = (propertyInfo.GetCustomAttributes(typedefof<DataMemberAttribute>, true).First() :?> DataMemberAttribute)
            dataMemberAttribute.Name
        | arg -> raise <| NotSupportedException(arg.ToString())
