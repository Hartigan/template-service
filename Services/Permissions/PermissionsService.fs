namespace Services.Permissions

open Models.Permissions
open Models.Identificators
open Services.Permissions
open Services.VersionControl
open Contexts
open DatabaseTypes
open System
open Models.Permissions
open Utils.ResultHelper

type PermissionsService(userService: IUserService,
                        groupContext: IGroupContext,
                        permissionsContext: IPermissionsContext,
                        versionControlService: IVersionControlService,
                        userGroupsContext: IContext<UserGroups>) =

    member this.GetUserGroups(userId: UserId) =
        async {
            match! userGroupsContext.Get(UserGroups.CreateDocumentKey(userId.Value)) with
            | Error(ex) ->
                return Error(ex)
            | Ok(userGroups) ->
                return UserGroupsModel.Create(userGroups)
        }

    member this.CreateMember(m: Member) =
        async {
            match! userService.Get(UserId(m.UserId)) with
            | Error(ex) ->
                return Error(ex)
            | Ok(user) ->
                return Ok({
                    MemberModel.UserId = user.Id
                    Name = user.Username
                    Access = AccessModel.Create(m.Access)
                })
        }

    member this.CreateMembersList(members: List<Member>) =
        async {
            let! membersResults =
                members
                |> Seq.map(this.CreateMember)
                |> Async.Parallel

            return ResultOfSeq membersResults
        }
    
    member this.CreateGroupAccessModel(g: GroupAccess) =
        async {
            match! groupContext.Get(UserGroup.CreateDocumentKey(g.GroupId)) with
            | Error(ex) -> return Error(ex)
            | Ok(group) ->
                return Ok({
                    GroupAccessModel.GroupId = GroupId(g.GroupId)
                    Name = GroupName(group.Name)
                    Access = AccessModel.Create(g.Access)
                })
        }

    member this.CreateGroupsList(groups: List<GroupAccess>) =
        async {
            let! groupsAccessResults =
                groups
                |> Seq.map(this.CreateGroupAccessModel)
                |> Async.Parallel

            return ResultOfSeq groupsAccessResults
        }

    member this.CheckPermissions(permissions: Permissions, userId: UserId, access: AccessModel): Async<Result<unit, Exception>> = 
        async {
            let ownerId = UserId(permissions.OwnerId)

            if (ownerId = userId) then
                return Ok()
            else
                let isDirectAccess =
                    permissions.Members
                    |> Seq.exists(fun m ->
                        let memberId = UserId(m.UserId)
                        let hasAccess = AccessModel.Create(m.Access).IsAllowed(access)
                        memberId = userId && hasAccess
                    )

                if isDirectAccess then
                    return Ok()
                else
                    let! groupsResults =
                        permissions.Groups
                        |> Seq.filter(fun group -> AccessModel.Create(group.Access).IsAllowed(access))
                        |> Seq.map(fun group -> groupContext.Get(UserGroup.CreateDocumentKey(group.GroupId)))
                        |> Async.Parallel

                    let groupAccess =
                        groupsResults
                        |> Seq.collect(fun res ->
                            match res with
                            | Ok(group) -> group.Members
                            | _ -> []
                        )
                        |> Seq.exists(fun m ->
                            let memberId = UserId(m.UserId)
                            let hasAccess = AccessModel.Create(m.Access).IsAllowed(access)
                            memberId = userId && hasAccess
                        )

                    if groupAccess then
                        return Ok()
                    else
                        return Error(UnauthorizedAccessException(sprintf "UserId = %s" userId.Value) :> Exception)
        }

    member this.GetFolderPermissions(id: FolderId) =
        permissionsContext.Get(Folder.CreateDocumentKey(id.Value))

    member this.UpdateFolderPermissions(id: FolderId, updater: Permissions -> Permissions) =
        permissionsContext.Update(Folder.CreateDocumentKey(id.Value), updater)

    member this.GetHeadPermissions(id: HeadId) =
        permissionsContext.Get(Head.CreateDocumentKey(id.Value))

    member this.UpdateHeadPermissions(id: HeadId, updater: Permissions -> Permissions) =
        permissionsContext.Update(Head.CreateDocumentKey(id.Value), updater)

    member this.GetCommitPermissions(id: CommitId) =
        async {
            match! versionControlService.Get(id) with
            | Error(ex) -> return Error(ex)
            | Ok(commit) -> return! this.GetHeadPermissions(commit.HeadId)
        }

    member this.UpdateCommitPermissions(id: CommitId, updater: Permissions -> Permissions) =
        async {
            match! versionControlService.Get(id) with
            | Error(ex) -> return Error(ex)
            | Ok(commit) -> return! this.UpdateHeadPermissions(commit.HeadId, updater)
        }

    member this.GetSubmissionPermissions(id: SubmissionId) =
        permissionsContext.Get(Submission.CreateDocumentKey(id.Value))

    member this.UpdateSubmissionPermissions(id: SubmissionId, updater: Permissions -> Permissions) =
        permissionsContext.Update(Submission.CreateDocumentKey(id.Value), updater)

    member this.GetReportPermissions(id: ReportId) =
        permissionsContext.Get(Report.CreateDocumentKey(id.Value))

    member this.UpdateReportPermissions(id: ReportId, updater: Permissions -> Permissions) =
        permissionsContext.Update(Report.CreateDocumentKey(id.Value), updater)

    member this.GetPermissions(protectedId: ProtectedId) =
        match protectedId with
        | ProtectedId.Folder(id) -> this.GetFolderPermissions(id)
        | ProtectedId.Head(id) -> this.GetHeadPermissions(id)
        | ProtectedId.Commit(id) -> this.GetCommitPermissions(id)
        | ProtectedId.Submission(id) -> this.GetSubmissionPermissions(id)
        | ProtectedId.Report(id) -> this.GetReportPermissions(id)

    member this.UpdatePermissions(protectedId: ProtectedId, updater: Permissions -> Permissions) =
        match protectedId with
        | ProtectedId.Folder(id) -> this.UpdateFolderPermissions(id, updater)
        | ProtectedId.Head(id) -> this.UpdateHeadPermissions(id, updater)
        | ProtectedId.Commit(id) -> this.UpdateCommitPermissions(id, updater)
        | ProtectedId.Submission(id) -> this.UpdateSubmissionPermissions(id, updater)
        | ProtectedId.Report(id) -> this.UpdateReportPermissions(id, updater)

    member this.CreateGroups(groups: List<UserGroup>) : Async<Result<List<GroupModel>, Exception>> =
        async {
            let! result =
                groups
                |> Seq.map(fun group ->
                    async {
                        match! this.CreateMembersList(group.Members) with
                        | Error(ex) -> return Error(ex)
                        | Ok(members) ->
                            return Ok([{
                                GroupModel.Id = GroupId(group.Id)
                                OwnerId = UserId(group.OwnerId)
                                Name = GroupName(group.Name)
                                Description = GroupDescription(group.Description)
                                Members = members
                            }])
                    }
                )
                |> Async.Parallel

            return
                result
                |> Seq.fold (fun r x ->
                    match (r, x) with
                    | (Ok(l), Ok(r)) -> Ok(l @ r)
                    | errors -> Error(ErrorOf2 errors)
                ) (Result<List<GroupModel>, Exception>.Ok([]))
        }

    interface IPermissionsService with

        member this.SearchByContains(pattern) =
            async {
                match! groupContext.SearchByContainsInName(pattern) with
                | Error(ex) -> return Error(ex)
                | Ok(groups) -> return! this.CreateGroups(groups)
            }

        member this.Get(userId: UserId, access: AccessModel) : Async<Result<List<GroupModel>, Exception>> =
            async {
                match! this.GetUserGroups(userId) with
                | Error(ex) -> return Error(ex)
                | Ok(groupIds) ->
                    let! assignedGroupsResults =
                        groupIds.Groups
                        |> Seq.map(fun id -> UserGroup.CreateDocumentKey(id.Value))
                        |> Seq.map groupContext.Get
                        |> Async.Parallel

                    let assignedGroups = ResultOfSeq assignedGroupsResults
                    let! ownedGroups = groupContext.GetByUser(userId.Value)
                
                    match (assignedGroups, ownedGroups) with
                    | (Ok(assigned), Ok(owned)) ->
                        let! allGroups =
                            this.CreateGroups(
                                (assigned @ owned)
                                |> Seq.distinctBy(fun x -> x.Id)
                                |> List.ofSeq
                            )

                        match allGroups with
                        | Ok(groups) ->
                            return
                                Ok(
                                    groups
                                    |> Seq.filter(fun group ->
                                        group.OwnerId = userId ||
                                        group.Members
                                        |> Seq.exists(fun m ->
                                            m.UserId = userId && m.Access.IsAllowed(access)
                                        )
                                    )
                                    |> List.ofSeq
                                )
                        | Error(error) -> return Error(error)
                    | errors -> return Error(ErrorOf2 errors)
            }

        member this.CheckPermissions(id: GroupId, userId: UserId, access: AccessModel) =
            async {
                match! (this :> IPermissionsService).Get(id)  with
                | Error(ex) -> return Error(ex)
                | Ok(group) ->
                    if group.OwnerId = userId then
                        return Ok()
                    else
                        return
                            group.Members
                            |> Seq.exists(fun m -> m.UserId = userId && m.Access.IsAllowed(access))
                            |> fun allowed ->
                                if allowed then
                                    Ok()
                                else
                                    Error(UnauthorizedAccessException(sprintf "UserId = %s" userId.Value) :> Exception)
            }

        member this.Get(id: GroupId) =
            async {
                match! groupContext.Get(UserGroup.CreateDocumentKey(id.Value)) with
                | Error(ex) -> return Error(ex)
                | Ok(group) ->
                    match! this.CreateMembersList(group.Members) with
                    | Error(ex) -> return Error(ex)
                    | Ok(membersList) ->
                        return Ok({
                            GroupModel.Id = id
                            OwnerId = UserId(group.OwnerId)
                            Name = GroupName(group.Name)
                            Description = GroupDescription(group.Description)
                            Members = membersList
                        })
            }

        member this.Get(protectedId: ProtectedId) =
            async {
                match! this.GetPermissions(protectedId) with
                | Error(ex) -> return Error(ex)
                | Ok(permissions) ->
                    let! membersListResult = this.CreateMembersList(permissions.Members)
                    let! groupsListResult = this.CreateGroupsList(permissions.Groups)
                    match (membersListResult, groupsListResult) with
                    | (Ok(membersList), Ok(groupsList)) ->
                        return Ok({
                            PermissionsModel.OwnerId = UserId(permissions.OwnerId)
                            Groups = groupsList
                            Members = membersList
                        })
                    | errors -> return Error(ErrorOf2 errors)
            }

        member this.CheckPermissions(protectedId, userId, access) =
            async {
                match! this.GetPermissions(protectedId) with
                | Error(ex) -> return Error(ex)
                | Ok(permissions) -> return! this.CheckPermissions(permissions, userId, access)
            } 

        member this.Create(userId, groupName, groupDescription) =
            async {
                let group = {
                    UserGroup.Id = Guid.NewGuid().ToString()
                    OwnerId = userId.Value
                    Name = groupName.Value
                    Description = groupDescription.Value
                    Members = []
                }

                match! groupContext.Insert(group, group) with
                | Ok() -> return Ok(GroupId(group.Id))
                | Error(ex) -> return Error(ex)
            }

        member this.Update(id: GroupId, nameOpt: Option<GroupName>, descriptionOpt: Option<GroupDescription>) =
            groupContext.Update
                (UserGroup.CreateDocumentKey(id.Value),
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
            async {
                let! resultGroup =
                    groupContext.Update
                        (UserGroup.CreateDocumentKey(id.Value),
                        (fun group ->
                            {
                                group with
                                    Members =
                                        group.Members
                                        |> Seq.filter(fun m -> m.UserId <> userId.Value)
                                        |> List.ofSeq
                            }
                        ))

                let! resultUserGroups =
                    userGroupsContext.Update
                        (UserGroups.CreateDocumentKey(userId.Value),
                        (fun userGroups ->
                            {
                                userGroups with
                                    Groups =
                                        userGroups.Groups
                                        |> Seq.filter(fun gid -> GroupId(gid) <> id)
                                        |> List.ofSeq
                            }
                        ))

                match (resultGroup, resultUserGroups) with
                | (Ok(), Ok()) -> return Ok()
                | errors -> return Error(ErrorOf2 errors)
            }

        member this.Update(id: GroupId, userId: UserId, access: AccessModel) =
            groupContext.Update
                (UserGroup.CreateDocumentKey(id.Value),
                (fun group ->
                    {
                        group with
                            Members =
                                group.Members
                                |> Seq.map(fun m ->
                                    if m.UserId = userId.Value then
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
            async {
                let! resultGroup =
                    groupContext.Update
                        (UserGroup.CreateDocumentKey(id.Value),
                        (fun group ->
                            let memberExists =
                                group.Members
                                    |> Seq.exists(fun m -> m.UserId = userId.Value)
                            if memberExists then
                                group
                            else
                                let newMember = {
                                    Member.UserId = userId.Value
                                    Access = 0UL;
                                }
                                {
                                    group with
                                        Members = group.Members @ [ newMember ]
                                }
                        ))
                let! resultUserGroups =
                    userGroupsContext.Update
                        (UserGroups.CreateDocumentKey(userId.Value),
                        (fun userGroups ->
                            let groupExists =
                                userGroups.Groups
                                    |> Seq.exists(fun gid -> GroupId(gid) = id)
                            if groupExists then
                                userGroups
                            else
                                {
                                    userGroups with
                                        Groups = userGroups.Groups @ [ id.Value ]
                                }
                        ))

                match (resultGroup, resultUserGroups) with
                | (Ok(), Ok()) -> return Ok()
                | errors -> return Error(ErrorOf2 errors)
            }

        member this.Add(id: ProtectedId, userId: UserId) =
            this.UpdatePermissions
                (id,
                (fun permissions ->
                    let memberExists =
                        permissions.Members
                            |> Seq.exists(fun m -> m.UserId = userId.Value)
                    if memberExists then
                        permissions
                    else
                        let newMember = {
                            Member.UserId = userId.Value
                            Access = 0UL
                        }
                        {
                            permissions with
                                Members = permissions.Members @ [ newMember ]
                        }
                ))

        member this.Add(id: ProtectedId, groupId: GroupId) =
            this.UpdatePermissions
                (id,
                (fun permissions ->
                    let groupExists =
                        permissions.Groups
                            |> Seq.exists(fun g -> g.GroupId = groupId.Value)
                    if groupExists then
                        permissions
                    else
                        let newGroup = {
                            GroupAccess.GroupId = groupId.Value
                            Access = 0UL
                        }
                        {
                            permissions with
                                Groups = permissions.Groups @ [ newGroup ]
                        }
                ))

        member this.Update(id: ProtectedId, userId: UserId, accessOpt: Option<AccessModel>) = 
            let accessFlagsOpt = accessOpt |> Option.map(fun x -> x.ToFlags())

            this.UpdatePermissions
                (id,
                fun perm ->
                    match accessFlagsOpt with
                    | None ->
                        {
                            perm with
                                Members =
                                    perm.Members
                                    |> Seq.filter(fun m -> m.UserId <> userId.Value)
                                    |> List.ofSeq
                        }
                    | Some(accessFlags) ->
                        {
                            perm with
                                Members =
                                    perm.Members
                                    |> Seq.map(fun m ->
                                        if m.UserId = userId.Value then
                                            {
                                                m with
                                                    Access = accessFlags
                                            }
                                        else
                                            m
                                    )
                                    |> List.ofSeq
                        }
                )

        member this.Update(id: ProtectedId, groupId: GroupId, accessOpt: Option<AccessModel>) = 
            let accessFlagsOpt = accessOpt |> Option.map(fun x -> x.ToFlags())

            this.UpdatePermissions
                (id,
                fun perm ->
                    match accessFlagsOpt with
                    | None ->
                        {
                            perm with
                                Groups =
                                    perm.Groups
                                    |> Seq.filter(fun m -> m.GroupId <> groupId.Value)
                                    |> List.ofSeq
                        }
                    | Some(accessFlags) ->
                        {
                            perm with
                                Groups =
                                    perm.Groups
                                    |> Seq.map(fun m ->
                                        if m.GroupId = groupId.Value then
                                            {
                                                m with
                                                    Access = accessFlags
                                            }
                                        else
                                            m
                                    )
                                    |> List.ofSeq
                        }
                )
