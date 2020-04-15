namespace Models.Permissions

open DatabaseTypes
open Models.Identificators
open Models.Converters
open System.Text.Json.Serialization
open System

type UserGroupsModel =
    {
        [<JsonPropertyName("id")>]
        UserId: UserId
        [<JsonPropertyName("Groups")>]
        Groups: List<GroupId>
    }

    static member Create(userGroups: UserGroups) : Result<UserGroupsModel, Exception> =
        Ok({
            UserGroupsModel.UserId  = UserId(userGroups.UserId)
            Groups                  = userGroups.Groups |> Seq.map(fun id -> GroupId(id)) |> List.ofSeq
        })
