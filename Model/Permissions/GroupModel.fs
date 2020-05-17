namespace Models.Permissions

open DatabaseTypes.Identificators
open Utils.Converters
open System.Text.Json.Serialization

[<JsonConverter(typeof<GroupNameConverter>)>]
type GroupName(groupName: string) =
    member val Value = groupName with get

and GroupNameConverter() =
    inherit StringConverter<GroupName>((fun m -> m.Value),
                                       (fun s -> GroupName(s)))

[<JsonConverter(typeof<GroupDescriptionConverter>)>]
type GroupDescription(groupDescription: string) =
    member val Value = groupDescription with get

and GroupDescriptionConverter() =
    inherit StringConverter<GroupDescription>((fun m -> m.Value),
                                              (fun s -> GroupDescription(s)))

type GroupModel =
    {
        [<JsonPropertyName("id")>]
        Id: GroupId
        [<JsonPropertyName("owner_id")>]
        OwnerId: UserId
        [<JsonPropertyName("name")>]
        Name: GroupName
        [<JsonPropertyName("description")>]
        Description: GroupDescription
        [<JsonPropertyName("members")>]
        Members: List<MemberModel>
    }
