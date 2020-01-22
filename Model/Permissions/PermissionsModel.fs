namespace Models.Permissions

open DatabaseTypes
open Models.Identificators
open System.Text.Json.Serialization

type PermissionsModel =
    {
        [<JsonPropertyName("owner_id")>]
        OwnerId: UserId
        [<JsonPropertyName("groups")>]
        Groups: List<GroupAccessModel>
        [<JsonPropertyName("members")>]
        Members: List<MemberModel>
    }

    static member Create(ownerId: UserId) : PermissionsModel =
        {
            OwnerId = ownerId
            Groups = []
            Members = []
        }