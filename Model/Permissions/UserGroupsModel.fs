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
            UserGroupsModel.UserId  = userGroups.UserId
            Allowed                 = userGroups.Allowed
            Owned                   = userGroups.Owned
        })
