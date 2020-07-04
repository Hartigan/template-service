namespace DatabaseTypes

open System.Text.Json.Serialization
open DatabaseTypes.Identificators
open Utils.Converters

[<JsonConverter(typeof<GroupItemsTypeConverter>)>]
type GroupItemsType private () =
    inherit BaseType("group_items")
    static member Instance = GroupItemsType()
and GroupItemsTypeConverter() =
    inherit StringConverter<GroupItemsType>((fun m -> m.Value), (fun _ -> GroupItemsType.Instance))

type ProtectedItems =
    {
        [<JsonPropertyName("heads")>]
        Heads : List<HeadId>
        [<JsonPropertyName("folders")>]
        Folders : List<FolderId>
        [<JsonPropertyName("submissions")>]
        Submissions : List<SubmissionId>
        [<JsonPropertyName("reports")>]
        Reports : List<ReportId>
    }

type GroupItems = 
    {
        [<JsonPropertyName("user_id")>]
        GroupId : GroupId
        [<JsonPropertyName("allowed")>]
        Allowed: ProtectedItems
        [<JsonPropertyName("type")>]
        Type : GroupItemsType
    }

    static member CreateDocumentKey(id: GroupId): DocumentKey =
        DocumentKey.Create(id.Value, GroupItemsType.Instance.Value)
    member private this.DocKey = GroupItems.CreateDocumentKey(this.GroupId)

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key

[<JsonConverter(typeof<UserItemsTypeConverter>)>]
type UserItemsType private () =
    inherit BaseType("user_items")
    static member Instance = UserItemsType()
and UserItemsTypeConverter() =
    inherit StringConverter<UserItemsType>((fun m -> m.Value), (fun _ -> UserItemsType.Instance))

type UserItems = 
    {
        [<JsonPropertyName("user_id")>]
        UserId : UserId
        [<JsonPropertyName("owned")>]
        Owned: ProtectedItems
        [<JsonPropertyName("allowed")>]
        Allowed: ProtectedItems
        [<JsonPropertyName("type")>]
        Type : UserItemsType
    }

    static member CreateDocumentKey(id: UserId): DocumentKey =
        DocumentKey.Create(id.Value, UserItemsType.Instance.Value)
    member private this.DocKey = UserItems.CreateDocumentKey(this.UserId)

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key
