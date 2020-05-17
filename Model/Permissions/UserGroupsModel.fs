namespace Models.Permissions

open DatabaseTypes
open DatabaseTypes.Identificators
open Utils.Converters
open System.Text.Json.Serialization
open System

type UserGroupsModel =
    {
        [<JsonPropertyName("id")>]
        UserId: UserId
        [<JsonPropertyName("allowed")>]
        Allowed: List<GroupId>
        [<JsonPropertyName("owned")>]
        Owned: List<GroupId>
    }

    static member Create(userGroups: UserGroups) : Result<UserGroupsModel, Exception> =
        Ok({
            UserGroupsModel.UserId  = UserId(userGroups.UserId)
            Allowed                 = userGroups.Allowed |> Seq.map(fun id -> GroupId(id)) |> List.ofSeq
            Owned                   = userGroups.Owned |> Seq.map(fun id -> GroupId(id)) |> List.ofSeq
        })
