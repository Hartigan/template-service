namespace DatabaseTypes

open System.Text.Json.Serialization
open DatabaseTypes.Identificators
open Utils.Converters

[<JsonConverter(typeof<UserGroupTypeConverter>)>]
type UserGroupType private () =
    inherit BaseType("user_group")
    static member Instance = UserGroupType()
and UserGroupTypeConverter() =
    inherit StringConverter<UserGroupType>((fun m -> m.Value), (fun _ -> UserGroupType.Instance))

type UserGroup =
    {
        [<JsonPropertyName("id")>]
        Id : GroupId
        [<JsonPropertyName("owner_id")>]
        OwnerId : UserId
        [<JsonPropertyName("name")>]
        Name : string
        [<JsonPropertyName("description")>]
        Description : string
        [<JsonPropertyName("members")>]                
        Members : List<Member>
        [<JsonPropertyName("type")>]
        Type : UserGroupType
    }

    static member CreateDocumentKey(id: GroupId): DocumentKey =
        DocumentKey.Create(id.Value, UserGroupType.Instance.Value)
    member private this.DocKey = UserGroup.CreateDocumentKey(this.Id)

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key

