namespace Services.Permissions

open Models.Permissions
open DatabaseTypes
open DatabaseTypes.Identificators
open System
open Utils.ResultHelper
open Contexts
open FSharp.Control

type GroupService(groupContext: IGroupContext,
                  groupItemsContext: IContext<GroupItems>,
                  userGroupsContext: IContext<UserGroups>,
                  userService: IUserService) =

    member this.CreateMember(m: Member) =
        userService.Get(m.UserId)
        |> Async.MapResult(fun user ->
            {
                MemberModel.UserId = user.Id
                Name = user.Username
                Access = AccessModel.Create(m.Access)
            }
        )

    member this.CreateMembersList(members: List<Member>) =
        members
        |> Seq.map(this.CreateMember)
        |> ResultOfAsyncSeq

    member this.CreateGroup(group: UserGroup) =
        this.CreateMembersList(group.Members)
        |> Async.MapResult(fun members ->
            {
                GroupModel.Id = group.Id
                OwnerId = group.OwnerId
                Name = GroupName(group.Name)
                Description = GroupDescription(group.Description)
                Members = members
            }
        )

    member this.CreateGroups(groups: List<UserGroup>) : Async<Result<List<GroupModel>, Exception>> =
        groups
        |> Seq.map this.CreateGroup
        |> ResultOfAsyncSeq

    interface IGroupService with
        member this.Update(id: GroupId, nameOpt: Option<GroupName>, descriptionOpt: Option<GroupDescription>) =
            groupContext.Update
                (UserGroup.CreateDocumentKey(id),
                (fun group ->
                    match (nameOpt, descriptionOpt) with
                    | (Some(name), Some(description)) ->
                        { group with Name = name.Value; Description = description.Value }
                    | (Some(name), None) ->
                        { group with Name = name.Value }
                    | (None, Some(description)) ->
                        { group with Description = description.Value }
                    | (None, None) ->
                        group
                ))

        member this.Remove(id: GroupId, userId: UserId) =
            groupContext.Update
                (UserGroup.CreateDocumentKey(id),
                (fun group ->
                    {
                        group with
                            Members =
                                group.Members
                                |> Seq.filter(fun m -> m.UserId <> userId)
                                |> List.ofSeq
                    }
                ))
            |> Async.BindResult(fun _ -> 
                userGroupsContext.Update
                        (UserGroups.CreateDocumentKey(userId),
                        (fun userGroups ->
                            {
                                userGroups with
                                    Allowed =
                                        userGroups.Allowed
                                        |> Seq.filter(fun gid -> gid <> id)
                                        |> List.ofSeq
                            }
                        ))
            )
            |> Async.MapResult ignore

        member this.Update(id: GroupId, userId: UserId, access: AccessModel) =
            groupContext.Update
                (UserGroup.CreateDocumentKey(id),
                (fun group ->
                    {
                        group with
                            Members =
                                group.Members
                                |> Seq.map(fun m ->
                                    if m.UserId = userId then
                                        {
                                            m with
                                                Access = access.ToFlags()
                                        }
                                    else
                                        m
                                )
                                |> List.ofSeq
                    }
                ))

        member this.Add(id: GroupId, userId: UserId) =
            groupContext.Update
                (UserGroup.CreateDocumentKey(id),
                (fun group ->
                    let memberExists =
                        group.Members
                            |> Seq.exists(fun m -> m.UserId = userId)
                    if memberExists then
                        group
                    else
                        let newMember = {
                            Member.UserId = userId
                            Access = 0UL;
                        }
                        {
                            group with
                                Members = newMember :: group.Members
                        }
                ))
            |> Async.BindResult(fun _ ->
                userGroupsContext.Update
                    (UserGroups.CreateDocumentKey(userId),
                    (fun userGroups ->
                        let groupExists =
                            userGroups.Allowed
                                |> Seq.exists(fun gid -> gid = id)
                        if groupExists then
                            userGroups
                        else
                            {
                                userGroups with
                                    Allowed = id :: userGroups.Allowed
                            }
                    ))
            )
            |> Async.MapResult ignore

        member this.Get(id: GroupId) =
            groupContext.Get(UserGroup.CreateDocumentKey(id))
            |> Async.BindResult(fun group ->
                this.CreateMembersList(group.Members)
                |> Async.MapResult(fun membersList ->
                    {
                        GroupModel.Id = id
                        OwnerId = group.OwnerId
                        Name = GroupName(group.Name)
                        Description = GroupDescription(group.Description)
                        Members = membersList
                    }
                )
            )

        member this.Search(pattern, offset, limit) =
            groupContext.Search(pattern, offset, limit)
            |> Async.BindResult this.CreateGroups

        member this.Create(userId, groupName, groupDescription) =
            let groupId = GroupId(Guid.NewGuid().ToString())

            let group = {
                    UserGroup.Id = groupId
                    Type = UserGroupType.Instance
                    OwnerId = userId
                    Name = groupName.Value
                    Description = groupDescription.Value
                    Members = []
                }

            let groupItems = {
                    GroupItems.GroupId = groupId
                    Type = GroupItemsType.Instance
                    Allowed = []
                }

            groupContext.Insert(group, group)
            |> Async.BindResult(fun _ -> groupItemsContext.Insert(groupItems, groupItems))
            |> Async.BindResult(fun _ ->
                userGroupsContext.Update
                    (UserGroups.CreateDocumentKey(userId),
                    (fun userGroups ->
                        {
                            userGroups with
                                Owned = groupId :: userGroups.Owned
                        }
                    ))
            )
            |> Async.MapResult(fun _ -> groupId)