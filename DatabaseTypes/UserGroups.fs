namespace DatabaseTypes

open System.Text.Json.Serialization
open DatabaseTypes.Identificators
open Utils.Converters

[<JsonConverter(typeof<UserGroupsTypeConverter>)>]
type UserGroupsType private () =
    inherit BaseType("user_groups")
    static member Instance = UserGroupsType()
and UserGroupsTypeConverter() =
    inherit StringConverter<UserGroupsType>((fun m -> m.Value), (fun _ -> UserGroupsType.Instance))

type UserGroups = 
    {
        [<JsonPropertyName("user_id")>]
        UserId : UserId
        [<JsonPropertyName("owned")>]
        Owned: List<GroupId>
        [<JsonPropertyName("allowed")>]
        Allowed: List<GroupId>
        [<JsonPropertyName("type")>]
        Type : UserGroupsType
    }

    static member CreateDocumentKey(id: UserId): DocumentKey =
        DocumentKey.Create(id.Value, UserGroupsType.Instance.Value)
    member private this.DocKey = UserGroups.CreateDocumentKey(this.UserId)

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
