namespace DatabaseTypes

open System.Runtime.Serialization;


[<DataContract>]
type GroupAccess =
    {
        [<field: DataMember(Name = "group_id")>]
        GroupId : string
        [<field: DataMember(Name = "access")>]
        Access : uint64
    }
