namespace DatabaseTypes

open System.Runtime.Serialization

[<DataContract>]
type Permissions = {
    [<field: DataMember(Name = "owner_id")>]
    OwnerId : string
}