namespace Services.Permissions

open System
open Models.Permissions
open DatabaseTypes.Identificators
open Utils.Converters
open DatabaseTypes

type IPermissionsService =
    abstract member CheckPermissions : ProtectedId * UserId * AccessModel -> Async<Result<unit, Exception>>
    abstract member CheckPermissions : GroupId * UserId * AccessModel -> Async<Result<unit, Exception>>

    abstract member GetHeads : UserId * AccessModel -> Async<Result<List<HeadId>, Exception>>
    abstract member GetFolders : UserId * AccessModel -> Async<Result<List<FolderId>, Exception>>
    abstract member GetReports : UserId * AccessModel -> Async<Result<List<ReportId>, Exception>>
    abstract member GetSubmissions : UserId * AccessModel -> Async<Result<List<SubmissionId>, Exception>>

    abstract member Get : UserId * AccessModel -> Async<Result<List<GroupModel>, Exception>>
    abstract member Get : ProtectedId -> Async<Result<PermissionsModel, Exception>>
    abstract member Get : UserId * ProtectedId -> Async<Result<AccessModel, Exception>>
    abstract member Update : ProtectedId * UserId * AccessModel -> Async<Result<unit, Exception>>
    abstract member Update : ProtectedId * GroupId * AccessModel -> Async<Result<unit, Exception>>
    abstract member Share : ProtectedId * UserId -> Async<Result<unit, Exception>>
    abstract member Share : ProtectedId * GroupId -> Async<Result<unit, Exception>>
    abstract member Add : ProtectedId * UserId -> Async<Result<unit, Exception>>
    abstract member Add : ProtectedId * GroupId -> Async<Result<unit, Exception>>
    abstract member Remove : ProtectedId * UserId -> Async<Result<unit, Exception>>
    abstract member Remove : ProtectedId * GroupId -> Async<Result<unit, Exception>>
    abstract member UserItemsAppend : ProtectedId * UserId -> Async<Result<unit, Exception>>
    abstract member Remove : ProtectedId -> Async<Result<unit, Exception>>
    abstract member GetOwner : ProtectedId -> Async<Result<UserId, Exception>>