namespace DatabaseTypes

open System.Runtime.Serialization;

[<DataContract>]
type Code =
    {
        [<field: DataMember(Name = "language")>]
        Language : string
        [<field: DataMember(Name = "content")>]
        Content : string
    }
