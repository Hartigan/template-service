namespace Services.Permissions

open Models.Permissions
open DatabaseTypes.Identificators
open Services.Permissions
open Contexts
open DatabaseTypes
open System
open Models.Permissions
open Utils.ResultHelper
open FSharp.Control

type PermissionsService(userService: IUserService,
                        groupService: IGroupService,
                        userContext: IUserContext,
                        groupContext: IGroupContext,
                        permissionsContext: IPermissionsContext,
                        userGroupsContext: IContext<UserGroups>,
                        userItemsContext: IContext<UserItems>,
                        groupItemsContext: IContext<GroupItems>) =

    member this.GetUserGroups(userId: UserId) =
        userGroupsContext.Get(UserGroups.CreateDocumentKey(userId))
        |> Async.TryMapResult UserGroupsModel.Create

    member this.GetUserItems(userId: UserId) =
        userItemsContext.Get(UserItems.CreateDocumentKey(userId))
        |> Async.TryMapResult UserItemsModel.Create

    member this.GetGroupItems(groupId: GroupId) =
        groupItemsContext.Get(GroupItems.CreateDocumentKey(groupId))
        |> Async.TryMapResult GroupItemsModel.Create

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
    
    member this.CreateGroupAccessModel(g: GroupAccess) =
        groupContext.Get(UserGroup.CreateDocumentKey(g.GroupId))
        |> Async.MapResult(fun group ->
            {
                GroupAccessModel.GroupId = g.GroupId
                Name = GroupName(group.Name)
                Access = AccessModel.Create(g.Access)
            }
        )

    member this.CreateGroupsList(groups: List<GroupAccess>) =
        groups
        |> Seq.map(this.CreateGroupAccessModel)
        |> ResultOfAsyncSeq

    member this.CheckPermissions(permissions: Permissions, userId: UserId, access: AccessModel): Async<Result<unit, Exception>> = 
        let ownerId = permissions.OwnerId

        if (ownerId = userId) then
            async.Return(Ok())
        else
            let isDirectAccess =
                permissions.Members
                |> Seq.exists(fun m ->
                    let memberId = m.UserId
                    let hasAccess = AccessModel.Create(m.Access).IsAllowed(access)
                    memberId = userId && hasAccess
                )

            if isDirectAccess then
                async.Return(Ok())
            else
                permissions.Groups
                |> Seq.filter(fun group -> AccessModel.Create(group.Access).IsAllowed(access))
                |> Seq.map(fun group -> groupContext.Get(UserGroup.CreateDocumentKey(group.GroupId)))
                |> ResultOfAsyncSeq
                |> Async.TryMapResult(fun groupsResults ->
                    let groupAccess =
                        groupsResults
                        |> Seq.collect(fun group -> group.Members)
                        |> Seq.exists(fun m ->
                            let memberId = m.UserId
                            let hasAccess = AccessModel.Create(m.Access).IsAllowed(access)
                            memberId = userId && hasAccess
                        )

                    if groupAccess then
                        Ok()
                    else
                        Error(UnauthorizedAccessException(sprintf "UserId = %s" userId.Value) :> Exception)
                )

    member this.GetPermissions(protectedId: ProtectedId) =
        match protectedId with
        | ProtectedId.Folder(id) -> permissionsContext.Get(Folder.CreateDocumentKey(id))
        | ProtectedId.Head(id) -> permissionsContext.Get(Head.CreateDocumentKey(id))
        | ProtectedId.Submission(id) -> permissionsContext.Get(Submission.CreateDocumentKey(id))
        | ProtectedId.Report(id) -> permissionsContext.Get(Report.CreateDocumentKey(id))

    member this.UpdatePermissions(protectedId: ProtectedId, updater: Permissions -> Permissions) =
        match protectedId with
        | ProtectedId.Folder(id) -> permissionsContext.Update(Folder.CreateDocumentKey(id), updater)
        | ProtectedId.Head(id) -> permissionsContext.Update(Head.CreateDocumentKey(id), updater)
        | ProtectedId.Submission(id) -> permissionsContext.Update(Submission.CreateDocumentKey(id), updater)
        | ProtectedId.Report(id) -> permissionsContext.Update(Report.CreateDocumentKey(id), updater)

    interface IPermissionsService with
        member this.Remove(id: ProtectedId) =
            let rawId =
                match id with
                | ProtectedId.Folder(folderId) -> folderId.Value
                | ProtectedId.Head(headId) -> headId.Value
                | ProtectedId.Submission(submissionId) -> submissionId.Value
                | ProtectedId.Report(reportId) -> reportId.Value

            this.GetPermissions(id)
            |> Async.BindResult(fun permissions ->
                permissions.Members
                |> Seq.map(fun m -> m.UserId)
                |> Seq.append(seq { permissions.OwnerId })
                |> Seq.map(fun userId ->
                    userItemsContext.Update(UserItems.CreateDocumentKey(userId), fun userItems ->
                        {
                            userItems with
                                Allowed =
                                    userItems.Allowed
                                    |> Seq.filter(fun x -> x.Id <> rawId)
                                    |> List.ofSeq
                                Owned =
                                    userItems.Owned
                                    |> Seq.filter(fun x -> x.Id <> rawId)
                                    |> List.ofSeq
                        }
                    )
                )
                |> ResultOfAsyncSeq
                |> Async.MapResult(fun _ -> permissions)
            )
            |> Async.BindResult(fun permissions ->
                permissions.Groups
                |> Seq.map(fun group ->
                    groupItemsContext.Update(GroupItems.CreateDocumentKey(group.GroupId), fun groupItems ->
                        {
                            groupItems with
                                Allowed =
                                    groupItems.Allowed
                                    |> Seq.filter(fun x -> x.Id <> rawId)
                                    |> List.ofSeq
                        }
                    )
                )
                |> ResultOfAsyncSeq
            )
            |> Async.MapResult ignore

        member this.GetOwner(protectedId) = 
            this.GetPermissions(protectedId)
            |> Async.MapResult(fun p -> p.OwnerId)

        member this.Get(userId: UserId, access: AccessModel, protectedType: ProtectedType) : Async<Result<List<ProtectedId>, Exception>> =
            this.GetUserGroups(userId)
            |> Async.BindResult(fun userGroups ->
                userGroups.Allowed
                |> Seq.map this.GetGroupItems
                |> ResultOfAsyncSeq
                |> Async.MapResult(fun groupsItems ->
                    groupsItems
                    |> Seq.collect(fun x -> x.Allowed)
                    |> Seq.filter(fun id ->
                        match (id, protectedType) with
                        | (ProtectedId.Folder(_), ProtectedType.Folder(_)) -> true
                        | (ProtectedId.Head(_), ProtectedType.Head(_)) -> true
                        | (ProtectedId.Submission(_), ProtectedType.Submission(_)) -> true
                        | (ProtectedId.Report(_), ProtectedType.Report(_)) -> true
                        | _ -> false
                    )
                )
            )
            |> Async.BindResult(fun ids ->
                this.GetUserItems(userId)
                |> Async.MapResult(fun userItems -> userItems.Allowed @ userItems.Owned)
                |> Async.MapResult(fun userIds -> 
                    userIds
                    |> Seq.append ids
                    |> Seq.distinct
                )
            )
            |> Async.BindResult(fun ids ->
                ids
                |> Seq.map(fun id ->
                    this.GetPermissions(id)
                    |> Async.BindResult(fun permissions ->
                        async {
                            match! this.CheckPermissions(permissions, userId, access) with
                            | Error(_) -> return Ok(false)
                            | Ok() -> return Ok(true)
                        }
                    )
                    |> Async.MapResult(fun hasPermissions -> (id, hasPermissions))
                )
                |> ResultOfAsyncSeq
            )
            |> Async.MapResult(fun x ->
                x
                |> Seq.filter(fun (_, hasPermissions) -> hasPermissions)
                |> Seq.map(fun (id, _) -> id)
                |> List.ofSeq
            )

        member this.Get(userId: UserId, access: AccessModel) : Async<Result<List<GroupModel>, Exception>> =
            this.GetUserGroups(userId)
            |> Async.BindResult(fun groupIds ->
                (groupIds.Allowed @ groupIds.Owned)
                |> Seq.distinct
                |> Seq.map groupService.Get
                |> ResultOfAsyncSeq
                |> Async.MapResult(fun groups ->
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
            )

        member this.CheckPermissions(id: GroupId, userId: UserId, access: AccessModel) =
            groupService.Get(id)
            |> Async.TryMapResult(fun group ->
                if group.OwnerId = userId then
                    Ok()
                else
                    group.Members
                    |> Seq.exists(fun m -> m.UserId = userId && m.Access.IsAllowed(access))
                    |> fun allowed ->
                        if allowed then
                            Ok()
                        else
                            Error(UnauthorizedAccessException(sprintf "UserId = %s" userId.Value) :> Exception)
            )

        member this.Get(protectedId: ProtectedId) =
            this.GetPermissions(protectedId)
            |> Async.BindResult(fun permissions ->
                this.CreateMembersList(permissions.Members)
                |> Async.BindResult(fun membersList ->
                    this.CreateGroupsList(permissions.Groups)
                    |> Async.MapResult(fun groupsList ->
                        {
                            PermissionsModel.OwnerId = permissions.OwnerId
                            Groups = groupsList
                            Members = membersList
                        }
                    )
                )
            )

        member this.CheckPermissions(protectedId : ProtectedId, userId, access) =
            this.GetPermissions(protectedId)
            |> Async.BindResult(fun permissions -> this.CheckPermissions(permissions, userId, access))

        member this.Add(id: ProtectedId, userId: UserId) =
            let protectedItem = id.ToEntity()
            this.UpdatePermissions
                (id,
                (fun permissions ->
                    let memberExists =
                        permissions.Members
                        |> Seq.exists(fun m -> m.UserId = userId)
                    if memberExists then
                        permissions
                    else
                        let newMember = {
                            Member.UserId = userId
                            Access = 0UL
                        }
                        {
                            permissions with
                                Members = newMember :: permissions.Members
                        }
                ))
            |> Async.BindResult(fun _ ->
                userItemsContext.Update
                    (UserItems.CreateDocumentKey(userId),
                    fun userItems ->
                        let itemExists =
                            userItems.Allowed
                            |> Seq.exists(fun x -> x.Id = protectedItem.Id)
                        if itemExists then
                            userItems
                        else
                            {
                                userItems with
                                    Allowed = protectedItem :: userItems.Allowed
                            }
                    )
            )
            |> Async.MapResult ignore
            

        member this.Add(id: ProtectedId, groupId: GroupId) =
            let protectedItem = id.ToEntity()
            this.UpdatePermissions
                (id,
                (fun permissions ->
                    let groupExists =
                        permissions.Groups
                            |> Seq.exists(fun g -> g.GroupId = groupId)
                    if groupExists then
                        permissions
                    else
                        let newGroup = {
                            GroupAccess.GroupId = groupId
                            Access = 0UL
                        }
                        {
                            permissions with
                                Groups = newGroup :: permissions.Groups
                        }
                ))
            |> Async.BindResult(fun _ ->
                groupItemsContext.Update
                    (GroupItems.CreateDocumentKey(groupId),
                    fun groupItems ->
                        let itemExists =
                            groupItems.Allowed
                            |> Seq.exists(fun x -> x.Id = protectedItem.Id)
                        if itemExists then
                            groupItems
                        else
                            {
                                groupItems with
                                    Allowed = protectedItem :: groupItems.Allowed
                            }
                    )
            )
            |> Async.MapResult ignore

        member this.Remove(id: ProtectedId, userId: UserId) =
            let protectedItem = id.ToEntity()
            this.UpdatePermissions
                (id,
                fun perm ->
                    {
                        perm with
                            Members =
                                perm.Members
                                |> Seq.filter(fun m -> m.UserId <> userId)
                                |> List.ofSeq
                    }
                )
            |> Async.BindResult(fun _ ->
                userItemsContext.Update(UserItems.CreateDocumentKey(userId),
                                        fun x ->
                                            {
                                                x with
                                                    Allowed =
                                                        x.Allowed
                                                        |> Seq.filter(fun x -> x <> protectedItem)
                                                        |> List.ofSeq
                                            }
                                        )
            )
            |> Async.MapResult ignore
            


        member this.Update(id: ProtectedId, userId: UserId, access: AccessModel) = 
            let accessFlags = access.ToFlags()
            this.UpdatePermissions
                (id,
                fun perm ->
                    {
                        perm with
                            Members =
                                perm.Members
                                |> Seq.map(fun m ->
                                    if m.UserId = userId then
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
        
        member this.Share(id: ProtectedId, userId: UserId) = 
            let accessFlags = AccessModel.CanRead.ToFlags()
            userContext.Exists(User.CreateDocumentKey(userId))
            |> Async.TryMapResult(fun exists ->
                if exists then
                    Ok()
                else
                    Result.Error(InvalidOperationException(sprintf "User with UserId %s not found" userId.Value) :> Exception)
            )
            |> Async.BindResult(fun _ ->
                this.UpdatePermissions
                    (id,
                    fun perm ->
                        let mmbr =
                            perm.Members
                            |> Seq.tryFind(fun m -> m.UserId = userId)
                            |> fun opt ->
                                match opt with
                                | None ->
                                    {
                                        UserId = userId
                                        Access = accessFlags
                                    }
                                | Some(m) ->
                                    {
                                        m with
                                            Access = accessFlags ||| m.Access
                                    }
                        {
                            perm with
                                Members =
                                    mmbr :: (perm.Members
                                    |> Seq.filter(fun m -> m.UserId <> userId)
                                    |> List.ofSeq)
                        }
                   )
            )
            |> Async.BindResult(fun _ ->
                userItemsContext.Update(UserItems.CreateDocumentKey(userId),
                                        fun x ->
                                            let protectedItem = id.ToEntity()
                                            {
                                                x with
                                                    Allowed = protectedItem :: (x.Allowed
                                                    |> Seq.filter(fun item -> item.Id <> protectedItem.Id)
                                                    |> List.ofSeq
                                                    )
                                            }
                                        )
            )

        member this.Share(id: ProtectedId, groupId: GroupId) = 
            let accessFlags = AccessModel.CanRead.ToFlags()
            groupContext.Exists(UserGroup.CreateDocumentKey(groupId))
            |> Async.TryMapResult(fun exists ->
                if exists then
                    Ok()
                else
                    Result.Error(InvalidOperationException(sprintf "Group with GroupId %s not found" groupId.Value) :> Exception)
            )
            |> Async.BindResult(fun _ ->
                this.UpdatePermissions
                    (id,
                    fun perm ->
                        let grp =
                            perm.Groups
                            |> Seq.tryFind(fun g -> g.GroupId = groupId)
                            |> fun opt ->
                                match opt with
                                | None ->
                                    {
                                        GroupId = groupId
                                        Access = accessFlags
                                    }
                                | Some(m) ->
                                    {
                                        m with
                                            Access = accessFlags ||| m.Access
                                    }
                        {
                            perm with
                                Groups =
                                    grp :: (perm.Groups
                                    |> Seq.filter(fun g -> g.GroupId <> groupId)
                                    |> List.ofSeq)
                        }
                   )
            )
            |> Async.BindResult(fun _ ->
                groupItemsContext.Update(GroupItems.CreateDocumentKey(groupId),
                                        fun x ->
                                            let protectedItem = id.ToEntity()
                                            {
                                                x with
                                                    Allowed = protectedItem :: (x.Allowed
                                                    |> Seq.filter(fun item -> item.Id <> protectedItem.Id)
                                                    |> List.ofSeq
                                                    )
                                            }
                                        )
            )

        member this.UserItemsAppend(id, userId) =
            userItemsContext.Update(UserItems.CreateDocumentKey(userId),
                                    fun x ->
                                        {
                                            x with
                                                Owned = id.ToEntity() :: x.Owned
                                        }
                                    )

        member this.Remove(id: ProtectedId, groupId: GroupId) =
            let protectedItem = id.ToEntity()
            this.UpdatePermissions
                (id,
                fun perm ->
                    {
                        perm with
                            Groups =
                                perm.Groups
                                |> Seq.filter(fun m -> m.GroupId <> groupId)
                                |> List.ofSeq
                    }
                )
            |> Async.BindResult(fun _ ->
                groupItemsContext.Update(GroupItems.CreateDocumentKey(groupId),
                                         fun x ->
                                             {
                                                 x with
                                                     Allowed =
                                                        x.Allowed
                                                        |> Seq.filter(fun x -> x <> protectedItem)
                                                        |> List.ofSeq
                                             }
                                         )
            )
            |> Async.MapResult ignore

        member this.Update(id: ProtectedId, groupId: GroupId, access: AccessModel) = 
            let accessFlags = access.ToFlags()
            this.UpdatePermissions
                (id,
                fun perm ->
                    {
                        perm with
                            Groups =
                                perm.Groups
                                |> Seq.map(fun m ->
                                    if m.GroupId = groupId then
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
