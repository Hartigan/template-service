namespace DatabaseTypes

open System.Runtime.Serialization;


[<DataContract>]
type Member =
    {
        [<field: DataMember(Name = "user_id")>]
        UserId : string
        [<field: DataMember(Name = "role")>]
        Role : string
    }
