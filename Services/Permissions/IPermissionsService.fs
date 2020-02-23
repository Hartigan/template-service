namespace Services.Permissions

open System
open Models.Permissions
open Models.Identificators
open Models.Converters
open DatabaseTypes

type CheckPermissionsFail =
    | Error of Exception
    | Unauthorized of unit

type CreateGroupFail =
    | Error of Exception

type UpdateGroupFail =
    | Error of Exception

type UpdatePermissionsFail =
    | Error of Exception

type GetGroupFail =
    | Error of Exception

type GetPermissionsFail =
    | Error of Exception

type ProtectedType =
    | Folder
    | Head
    | Commit
    | Submission
    | Report
    static member Create(typeName: string) : Result<ProtectedType, unit> =
        if typeName = Folder.TypeName then
            Ok(ProtectedType.Folder)
        elif typeName = Head.TypeName then
            Ok(ProtectedType.Head)
        elif typeName = Commit.TypeName then
            Ok(ProtectedType.Commit)
        elif typeName = Submission.TypeName then
            Ok(ProtectedType.Submission)
        elif typeName = Report.TypeName then
            Ok(ProtectedType.Report)
        else
            Result.Error()

type ProtectedId =
    | Folder of FolderId
    | Head of HeadId
    | Commit of CommitId
    | Submission of SubmissionId
    | Report of ReportId

    static member Create(id: string, typeName: string) =
        match ProtectedType.Create(typeName) with
            | Result.Error() ->
                Result.Error()
            | Ok(protectedType) ->
                Ok(
                    match protectedType with
                    | ProtectedType.Folder -> ProtectedId.Folder(FolderId(id))
                    | ProtectedType.Head -> ProtectedId.Head(HeadId(id))
                    | ProtectedType.Commit -> ProtectedId.Commit(CommitId(id))
                    | ProtectedType.Submission -> ProtectedId.Submission(SubmissionId(id))
                    | ProtectedType.Report -> ProtectedId.Report(ReportId(id))
                )

type IPermissionsService =
    abstract member CheckPermissions : ProtectedId * UserId * AccessModel -> Async<Result<unit, CheckPermissionsFail>>
    abstract member CheckPermissions : GroupId * UserId * AccessModel -> Async<Result<unit, CheckPermissionsFail>>
    abstract member Create : UserId * GroupName * GroupDescription -> Async<Result<GroupId, CreateGroupFail>>
    abstract member Get : UserId -> Async<Result<List<GroupModel>, GetGroupFail>>
    abstract member Get : GroupId -> Async<Result<GroupModel, GetGroupFail>>
    abstract member Get : ProtectedId -> Async<Result<PermissionsModel, GetPermissionsFail>>
    abstract member Update : GroupId * Option<GroupName> * Option<GroupDescription> -> Async<Result<unit, UpdateGroupFail>>
    abstract member Update : GroupId * UserId * Option<AccessModel> -> Async<Result<unit, UpdateGroupFail>>
    abstract member Add : GroupId * UserId -> Async<Result<unit, UpdateGroupFail>>
    abstract member Update : ProtectedId * UserId * Option<AccessModel> -> Async<Result<unit, UpdatePermissionsFail>>
    abstract member Update : ProtectedId * GroupId * Option<AccessModel> -> Async<Result<unit, UpdatePermissionsFail>>
    abstract member Add : ProtectedId * UserId -> Async<Result<unit, UpdatePermissionsFail>>
    abstract member Add : ProtectedId * GroupId -> Async<Result<unit, UpdatePermissionsFail>>