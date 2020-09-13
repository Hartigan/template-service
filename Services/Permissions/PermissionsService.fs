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
        |> Async.MapResult UserItemsModel.Create

    member this.GetGroupItems(groupId: GroupId) =
        groupItemsContext.Get(GroupItems.CreateDocumentKey(groupId))
        |> Async.MapResult GroupItemsModel.Create

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

    member this.GetAccess(permissions: Permissions, userId: UserId): Async<Result<AccessModel, Exception>> = 
        let ownerId = permissions.OwnerId

        if (ownerId = userId) then
            async.Return(Ok(AccessModel.CanAll))
        else
            let directAccess =
                permissions.Members
                |> Seq.tryFind(fun m -> m.UserId = userId)
                |> Option.map(fun m -> AccessModel.Create(m.Access))
                |> Option.defaultValue(AccessModel.CanNothing)

            permissions.Groups
            |> Seq.map(fun group ->
                groupContext.Get(UserGroup.CreateDocumentKey(group.GroupId))
                |> Async.MapResult(fun g -> (g, AccessModel.Create(group.Access)))
            )
            |> ResultOfAsyncSeq
            |> Async.MapResult(fun groupsResults ->
                groupsResults
                |> Seq.map(fun (g, a) ->
                    g.Members
                    |> Seq.tryFind(fun m -> m.UserId = userId)
                    |> Option.map(fun m -> AccessModel.Create(m.Access))
                    |> Option.defaultValue(AccessModel.CanNothing)
                    |> fun x -> x &&& a
                )
                |> Seq.fold(|||) directAccess
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

    member this.RemoveProtectedId(protectedId: ProtectedId) : ProtectedItems -> ProtectedItems =
        match protectedId with
        | ProtectedId.Head(headId) ->
            fun protectedItems ->
                {
                    protectedItems with
                        Heads =
                            protectedItems.Heads
                            |> List.filter(fun x -> x <> headId)
                }
        | ProtectedId.Folder(folderId) ->
            fun protectedItems ->
                {
                    protectedItems with
                        Folders =
                            protectedItems.Folders
                            |> List.filter(fun x -> x <> folderId)
                }
        | ProtectedId.Report(reportId) ->
            fun protectedItems ->
                {
                    protectedItems with
                        Reports =
                            protectedItems.Reports
                            |> List.filter(fun x -> x <> reportId)
                }
        | ProtectedId.Submission(submissionId) ->
            fun protectedItems ->
                {
                    protectedItems with
                        Submissions =
                            protectedItems.Submissions
                            |> List.filter(fun x -> x <> submissionId)
                }

    member this.ContainsProtectedId(protectedId: ProtectedId) : ProtectedItems -> bool =
        match protectedId with
        | ProtectedId.Head(headId) ->
            fun protectedItems -> protectedItems.Heads |> List.contains(headId)
        | ProtectedId.Folder(folderId) ->
            fun protectedItems -> protectedItems.Folders |> List.contains(folderId)
        | ProtectedId.Report(reportId) ->
            fun protectedItems -> protectedItems.Reports |> List.contains(reportId)
        | ProtectedId.Submission(submissionId) -> 
            fun protectedItems -> protectedItems.Submissions |> List.contains(submissionId)

    member this.AppendProtectedId(protectedId: ProtectedId) : ProtectedItems -> ProtectedItems =
        match protectedId with
        | ProtectedId.Head(headId) ->
            fun protectedItems ->
                {
                    protectedItems with
                        Heads = headId :: protectedItems.Heads
                }
        | ProtectedId.Folder(folderId) ->
            fun protectedItems ->
                {
                    protectedItems with
                        Folders = folderId :: protectedItems.Folders
                }
        | ProtectedId.Report(reportId) ->
            fun protectedItems ->
                {
                    protectedItems with
                        Reports = reportId :: protectedItems.Reports
                }
        | ProtectedId.Submission(submissionId) ->
            fun protectedItems ->
                {
                    protectedItems with
                        Submissions = submissionId :: protectedItems.Submissions
                }

    member this.AddIfNotExistsProtectedId(protectedId: ProtectedId) : ProtectedItems -> ProtectedItems =
        let checker = this.ContainsProtectedId(protectedId)
        let appender = this.AppendProtectedId(protectedId)

        fun protectedItems ->
            if checker(protectedItems) then
                protectedItems
            else
                appender(protectedItems)

    member this.GetProtectedIdsByType<'T when 'T : equality>(userId: UserId,
                                                             access: AccessModel,
                                                             userItemsGetter: UserItemsModel -> List<'T>,
                                                             groupsItemsGetter: GroupItemsModel -> List<'T>,
                                                             permissionsGetter: 'T -> Async<Result<Permissions, Exception>>) =
        this.GetUserGroups(userId)
            |> Async.BindResult(fun userGroups ->
                userGroups.Allowed
                |> Seq.map this.GetGroupItems
                |> ResultOfAsyncSeq
                |> Async.MapResult(fun groupsItems ->
                    groupsItems
                    |> Seq.collect groupsItemsGetter
                )
            )
            |> Async.BindResult(fun ids ->
                this.GetUserItems(userId)
                |> Async.MapResult userItemsGetter
                |> Async.MapResult(fun userIds -> 
                    userIds
                    |> Seq.append ids
                    |> Seq.distinct
                )
            )
            |> Async.BindResult(fun ids ->
                ids
                |> Seq.map(fun id ->
                    permissionsGetter(id)
                    |> Async.BindResult(fun permissions ->
                        async {
                            match! this.GetAccess(permissions, userId) with
                            | Error(_) -> return Ok(false)
                            | Ok(currentAccess) -> return Ok(currentAccess.IsAllowed(access))
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
        

    interface IPermissionsService with

        member this.SetIsPublic(protectedId, isPublic) =
            this.UpdatePermissions(protectedId, fun permissions ->
                {
                    permissions with
                        IsPublic = isPublic
                }
            )

        member this.Get(userId: UserId, protectedId: ProtectedId) =
            this.GetPermissions(protectedId)
            |> Async.BindResult(fun permissions ->
                this.GetAccess(permissions, userId)
            )

        member this.Remove(id: ProtectedId) =
            let remover = this.RemoveProtectedId(id)

            this.GetPermissions(id)
            |> Async.BindResult(fun permissions ->
                permissions.Members
                |> Seq.map(fun m -> m.UserId)
                |> Seq.append(Seq.singleton(permissions.OwnerId))
                |> Seq.map(fun userId ->
                    userItemsContext.Update(UserItems.CreateDocumentKey(userId), fun userItems ->
                        {
                            userItems with
                                Allowed = remover(userItems.Allowed)
                                Owned = remover(userItems.Owned)
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
                                Allowed = remover(groupItems.Allowed)
                        }
                    )
                )
                |> ResultOfAsyncSeq
            )
            |> Async.MapResult ignore

        member this.GetOwner(protectedId) = 
            this.GetPermissions(protectedId)
            |> Async.MapResult(fun p -> p.OwnerId)

        member this.GetHeads(userId: UserId, access: AccessModel) : Async<Result<List<HeadId>, Exception>> =
            this.GetProtectedIdsByType<HeadId>(userId,
                                               access,
                                               (fun x -> x.Allowed.Heads @ x.Owned.Heads),
                                               (fun x -> x.Allowed.Heads),
                                               (Head.CreateDocumentKey >> permissionsContext.Get))

        member this.GetFolders(userId: UserId, access: AccessModel) : Async<Result<List<FolderId>, Exception>> =
            this.GetProtectedIdsByType<FolderId>(userId,
                                                 access,
                                                 (fun x -> x.Allowed.Folders @ x.Owned.Folders),
                                                 (fun x -> x.Allowed.Folders),
                                                 (Folder.CreateDocumentKey >> permissionsContext.Get))
        
        member this.GetSubmissions(userId: UserId, access: AccessModel) : Async<Result<List<SubmissionId>, Exception>> =
            this.GetProtectedIdsByType<SubmissionId>(userId,
                                                     access,
                                                     (fun x -> x.Allowed.Submissions @ x.Owned.Submissions),
                                                     (fun x -> x.Allowed.Submissions),
                                                     (Submission.CreateDocumentKey >> permissionsContext.Get))

        member this.GetReports(userId: UserId, access: AccessModel) : Async<Result<List<ReportId>, Exception>> =
            this.GetProtectedIdsByType<ReportId>(userId,
                                                 access,
                                                 (fun x -> x.Allowed.Reports @ x.Owned.Reports),
                                                 (fun x -> x.Allowed.Reports),
                                                 (Report.CreateDocumentKey >> permissionsContext.Get))

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
                            IsPublic = permissions.IsPublic
                        }
                    )
                )
            )

        member this.CheckPermissions(protectedId : ProtectedId, userId, access) =
            this.GetPermissions(protectedId)
            |> Async.BindResult(fun permissions ->
                if access = AccessModel.CanGenerate && permissions.IsPublic then
                    async.Return(Result.Ok())
                else
                    this.GetAccess(permissions, userId)
                    |> Async.TryMapResult(fun x ->
                        if x.IsAllowed(access) then
                            Ok()
                        else
                            Error(UnauthorizedAccessException(sprintf "UserId = %s" userId.Value) :> Exception)
                    )
            )
            

        member this.Add(id: ProtectedId, userId: UserId) =
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
                let adder = this.AddIfNotExistsProtectedId(id)
                userItemsContext.Update
                    (UserItems.CreateDocumentKey(userId),
                    fun userItems ->
                        {
                            userItems with
                                Allowed = adder(userItems.Allowed)
                        }
                    )
            )
            |> Async.MapResult ignore
            

        member this.Add(id: ProtectedId, groupId: GroupId) =
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
                let adder = this.AddIfNotExistsProtectedId(id)
                groupItemsContext.Update
                    (GroupItems.CreateDocumentKey(groupId),
                    fun groupItems ->
                        {
                            groupItems with
                                Allowed = adder(groupItems.Allowed)
                        }
                    )
            )
            |> Async.MapResult ignore

        member this.Remove(id: ProtectedId, userId: UserId) =
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
                let remover = this.RemoveProtectedId(id)
                userItemsContext.Update(UserItems.CreateDocumentKey(userId),
                                        fun x ->
                                            {
                                                x with
                                                    Allowed = remover(x.Allowed)
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
            |> Async.BindResult(fun _ ->
                let adder = this.AddIfNotExistsProtectedId(id)
                userItemsContext.Update(UserItems.CreateDocumentKey(userId),
                                        fun x ->
                                            {
                                                x with
                                                    Allowed = adder(x.Allowed)
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
                let adder = this.AddIfNotExistsProtectedId(id)
                groupItemsContext.Update(GroupItems.CreateDocumentKey(groupId),
                                        fun x ->
                                            {
                                                x with
                                                    Allowed = adder(x.Allowed)
                                            }
                                        )
            )

        member this.UserItemsAppend(id, userId) =
            let adder = this.AddIfNotExistsProtectedId(id)
            userItemsContext.Update(UserItems.CreateDocumentKey(userId),
                                    fun x ->
                                        {
                                            x with
                                                Owned = adder(x.Owned)
                                        }
                                    )

        member this.Remove(id: ProtectedId, groupId: GroupId) =
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
                let remover = this.RemoveProtectedId(id)
                groupItemsContext.Update(GroupItems.CreateDocumentKey(groupId),
                                         fun x ->
                                             {
                                                 x with
                                                     Allowed = remover(x.Allowed)
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
