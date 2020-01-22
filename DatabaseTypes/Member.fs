namespace DatabaseTypes

open System.Runtime.Serialization;


[<DataContract>]
type Member =
    {
        [<field: DataMember(Name = "user_id")>]
        UserId : string
        [<field: DataMember(Name = "access")>]
        Access : uint64
    }
