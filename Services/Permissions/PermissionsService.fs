namespace Services.Permissions

open Models.Permissions
open Models.Identificators
open Services.Permissions
open Services.VersionControl
open Contexts
open DatabaseTypes
open System
open Models.Permissions

type PermissionsService(userService: IUserService,
                        groupContext: IGroupContext,
                        permissionsContext: IPermissionsContext,
                        versionControlService: IVersionControlService) =

    member this.CreateMember(m: Member) =
        async {
            match! userService.Get(UserId(m.UserId)) with
            | Result.Error(fail) ->
                return Result.Error(fail)
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

            return
                membersResults
                |> Seq.map(fun r ->
                    match r with
                    | Result.Error(fail) ->
                        Result.Error(fail)
                    | Ok(memberModel) ->
                        Ok([ memberModel ])
                )
                |> Seq.fold
                    (fun l r ->
                        match (l, r) with
                        | (Ok(lm), Ok(rm)) ->
                            Ok(lm @ rm)
                        | (Result.Error(fail), Ok(rm)) ->
                            Result.Error(fail)
                        | (Ok(lm), Result.Error(fail)) ->
                            Result.Error(fail)
                        | (Result.Error(lfail), Result.Error(rfail)) ->
                            Result.Error(lfail)
                    )
                    (Ok([]))
        }
    
    member this.CreateGroupAccessModel(g: GroupAccess) =
        async {
            match! groupContext.Get(UserGroup.CreateDocumentKey(g.GroupId)) with
            | Result.Error(fail) ->
                match fail with
                | GetDocumentFail.Error(error) ->
                    return Result.Error(GetPermissionsFail.Error(error))
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

            return
                groupsAccessResults
                |> Seq.map(fun r ->
                    match r with
                    | Result.Error(fail) ->
                        Result.Error(fail)
                    | Ok(groupAccessModel) ->
                        Ok([ groupAccessModel ])
                )
                |> Seq.fold
                    (fun l r ->
                        match (l, r) with
                        | (Ok(lm), Ok(rm)) ->
                            Ok(lm @ rm)
                        | (Result.Error(fail), Ok(rm)) ->
                            Result.Error(fail)
                        | (Ok(lm), Result.Error(fail)) ->
                            Result.Error(fail)
                        | (Result.Error(lfail), Result.Error(rfail)) ->
                            Result.Error(lfail)
                    )
                    (Ok([]))
        }

    member this.CheckPermissions(permissions: Permissions, userId: UserId, access: AccessModel): Async<Result<unit, CheckPermissionsFail>> = 
        async {
            let ownerId = UserId(permissions.OwnerId)

            if (ownerId = userId) then
                return Result.Ok()
            else
                let isDirectAccess =
                    permissions.Members
                    |> Seq.exists(fun m ->
                        let memberId = UserId(m.UserId)
                        let hasAccess = AccessModel.Create(m.Access).IsAllowed(access)
                        memberId = userId && hasAccess
                    )

                if isDirectAccess then
                    return Result.Ok()
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
                        return Result.Ok()
                    else
                        return Result.Error(CheckPermissionsFail.Unauthorized())
        }

    member this.GetFolderPermissions(id: FolderId) =
        async {
            match! permissionsContext.Get(Folder.CreateDocumentKey(id.Value)) with
            | Result.Error(fail) ->
                match fail with
                | GetDocumentFail.Error(error) ->
                    return Result.Error(GetPermissionsFail.Error(error))
            | Ok(permissions) ->
                return Ok(permissions)
        }

    member this.UpdateFolderPermissions(id: FolderId, updater: Permissions -> Permissions) =
        async {
            match! permissionsContext.Update(Folder.CreateDocumentKey(id.Value), updater) with
            | Result.Error(fail) ->
                match fail with
                | UpdateDocumentFail.Error(error) ->
                    return Result.Error(UpdatePermissionsFail.Error(error))
            | Ok() ->
                return Ok()
        }

    member this.GetHeadPermissions(id: HeadId) =
        async {
            match! permissionsContext.Get(Head.CreateDocumentKey(id.Value)) with
            | Result.Error(fail) ->
                match fail with
                | GetDocumentFail.Error(error) ->
                    return Result.Error(GetPermissionsFail.Error(error))
            | Ok(permissions) ->
                return Ok(permissions)
        }

    member this.UpdateHeadPermissions(id: HeadId, updater: Permissions -> Permissions) =
        async {
            match! permissionsContext.Update(Head.CreateDocumentKey(id.Value), updater) with
            | Result.Error(fail) ->
                match fail with
                | UpdateDocumentFail.Error(error) ->
                    return Result.Error(UpdatePermissionsFail.Error(error))
            | Ok() ->
                return Ok()
        }

    member this.GetCommitPermissions(id: CommitId) =
        async {
            match! versionControlService.Get(id) with
            | Result.Error(fail) ->
                match fail with
                | Services.VersionControl.GetFail.Error(error) ->
                    return Result.Error(GetPermissionsFail.Error(error))
            | Result.Ok(commit) ->
                return! this.GetHeadPermissions(commit.HeadId)
        }

    member this.UpdateCommitPermissions(id: CommitId, updater: Permissions -> Permissions) =
        async {
            match! versionControlService.Get(id) with
            | Result.Error(fail) ->
                match fail with
                | Services.VersionControl.GetFail.Error(error) ->
                    return Result.Error(UpdatePermissionsFail.Error(error))
            | Result.Ok(commit) ->
                return! this.UpdateHeadPermissions(commit.HeadId, updater)
        }

    member this.GetSubmissionPermissions(id: SubmissionId) =
        async {
            match! permissionsContext.Get(Submission.CreateDocumentKey(id.Value)) with
            | Result.Error(fail) ->
                match fail with
                | GetDocumentFail.Error(error) ->
                    return Result.Error(GetPermissionsFail.Error(error))
            | Ok(permissions) ->
                return Ok(permissions)
        }

    member this.UpdateSubmissionPermissions(id: SubmissionId, updater: Permissions -> Permissions) =
        async {
            match! permissionsContext.Update(Submission.CreateDocumentKey(id.Value), updater) with
            | Result.Error(fail) ->
                match fail with
                | UpdateDocumentFail.Error(error) ->
                    return Result.Error(UpdatePermissionsFail.Error(error))
            | Ok() ->
                return Ok()
        }

    member this.GetReportPermissions(id: ReportId) =
        async {
            match! permissionsContext.Get(Report.CreateDocumentKey(id.Value)) with
            | Result.Error(fail) ->
                match fail with
                | GetDocumentFail.Error(error) ->
                    return Result.Error(GetPermissionsFail.Error(error))
            | Ok(permissions) ->
                return Ok(permissions)
        }

    member this.UpdateReportPermissions(id: ReportId, updater: Permissions -> Permissions) =
        async {
            match! permissionsContext.Update(Report.CreateDocumentKey(id.Value), updater) with
            | Result.Error(fail) ->
                match fail with
                | UpdateDocumentFail.Error(error) ->
                    return Result.Error(UpdatePermissionsFail.Error(error))
            | Ok() ->
                return Ok()
        }

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

    member this.CreateGroups(groups: List<UserGroup>) : Async<Result<List<GroupModel>, GetGroupFail>> =
        async {
            let! result =
                groups
                |> Seq.map(fun group ->
                    async {
                        match! this.CreateMembersList(group.Members) with
                        | Result.Error(fail) ->
                            match fail with
                            | GetUserFail.Error(error) ->
                                return Result.Error(GetGroupFail.Error(error))
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
                    | (Result.Error(fail), _) -> Result.Error(fail)
                    | (_, Result.Error(fail)) -> Result.Error(fail)) (Result.Ok([]))
        }


    interface IPermissionsService with

        member this.SearchByContains(pattern) =
            async {
                match! groupContext.SearchByContainsInName(pattern) with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) ->
                        return Result.Error(GetGroupFail.Error(error))
                | Ok(groups) ->
                    return! this.CreateGroups(groups)
            }

        member this.Get(userId: UserId) : Async<Result<List<GroupModel>, GetGroupFail>> =
            async {
                match! groupContext.GetByUser(userId.Value) with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) ->
                        return Result.Error(GetGroupFail.Error(error))
                | Ok(groups) ->
                    return! this.CreateGroups(groups)
            }

        member this.CheckPermissions(id: GroupId, userId: UserId, access: AccessModel) =
            async {
                match! (this :> IPermissionsService).Get(id)  with
                | Result.Error(fail) ->
                    match fail with
                    | GetGroupFail.Error(error) ->
                        return Result.Error(CheckPermissionsFail.Error(error))
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
                                    Result.Error(CheckPermissionsFail.Unauthorized())
            }

        member this.Get(id: GroupId) =
            async {
                match! groupContext.Get(UserGroup.CreateDocumentKey(id.Value)) with
                | Result.Error(fail) ->
                    match fail with
                    | GetDocumentFail.Error(error) ->
                        return Result.Error(GetGroupFail.Error(error))
                | Ok(group) ->
                    match! this.CreateMembersList(group.Members) with
                    | Result.Error(fail) ->
                        match fail with
                        | GetUserFail.Error(error) ->
                            return Result.Error(GetGroupFail.Error(error))
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
                | Result.Error(fail) ->
                    return Result.Error(fail)
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
                    | (Result.Error(fail), _) ->
                        match fail with
                        | GetUserFail.Error(error) ->
                            return Result.Error(GetPermissionsFail.Error(error))
                    | (_, Result.Error(fail)) ->
                        return Result.Error(fail)
            }

        member this.CheckPermissions(protectedId, userId, access) =
            async {
                match! this.GetPermissions(protectedId) with
                | Result.Error(fail) ->
                    match fail with
                    | GetPermissionsFail.Error(error) ->
                        return Result.Error(CheckPermissionsFail.Error(error))
                | Ok(permissions) ->
                    return! this.CheckPermissions(permissions, userId, access)
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
                | Ok() ->
                    return Ok(GroupId(group.Id))
                | Result.Error(fail) ->
                    match fail with
                    | InsertDocumentFail.Error(error) ->
                        return Result.Error(CreateGroupFail.Error(error))
            }

        member this.Update(id: GroupId, nameOpt: Option<GroupName>, descriptionOpt: Option<GroupDescription>) =
            async {
                let! result =
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
                match result with
                | Ok() -> return Ok()
                | Result.Error(fail) ->
                    match fail with
                    | UpdateDocumentFail.Error(error) ->
                        return Result.Error(UpdateGroupFail.Error(error))
            }

        member this.Update(id: GroupId, userId: UserId, accessOpt: Option<AccessModel>) =
            async {
                let accessFlagsOpt = accessOpt |> Option.map(fun x -> x.ToFlags())

                let! result =
                    groupContext.Update
                        (UserGroup.CreateDocumentKey(id.Value),
                        (fun group ->
                            match accessFlagsOpt with
                            | None ->
                                {
                                    group with
                                        Members =
                                            group.Members
                                            |> Seq.filter(fun m -> m.UserId <> userId.Value)
                                            |> List.ofSeq
                                }
                            | Some(accessFlags) ->
                                {
                                    group with
                                        Members =
                                            group.Members
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
                        ))
                match result with
                | Ok() ->
                    return Ok()
                | Result.Error(fail) ->
                    match fail with
                    | UpdateDocumentFail.Error(error) ->
                        return Result.Error(UpdateGroupFail.Error(error))

            }

        member this.Add(id: GroupId, userId: UserId) =
            async {
                let! result =
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

                match result with
                | Ok() ->
                    return Ok()
                | Result.Error(fail) ->
                    match fail with
                    | UpdateDocumentFail.Error(error) ->
                        return Result.Error(UpdateGroupFail.Error(error))

            }

        member this.Add(id: ProtectedId, userId: UserId) =
            async {
                let! result =
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

                return result
            }

        member this.Add(id: ProtectedId, groupId: GroupId) =
            async {
                let! result =
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

                return result
            }

        member this.Update(id: ProtectedId, userId: UserId, accessOpt: Option<AccessModel>) = 
            async {
                let accessFlagsOpt = accessOpt |> Option.map(fun x -> x.ToFlags())

                return!
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
            }

        member this.Update(id: ProtectedId, groupId: GroupId, accessOpt: Option<AccessModel>) = 
            async {
                let accessFlagsOpt = accessOpt |> Option.map(fun x -> x.ToFlags())

                return!
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
            }
