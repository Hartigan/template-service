namespace DatabaseTypes

open System.Runtime.Serialization

[<DataContract>]
type Permissions = {
    [<field: DataMember(Name = "owner_id")>]
    OwnerId : string
    [<field: DataMember(Name = "groups")>]
    Groups: List<GroupAccess>
    [<field: DataMember(Name = "members")>]
    Members: List<Member>
}