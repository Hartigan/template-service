namespace Services.Permissions

open System
open Models.Permissions
open Models.Identificators
open Models.Converters
open DatabaseTypes

type ProtectedType =
    | Folder
    | Head
    | Commit
    | Submission
    | Report
    static member Create(typeName: string) : Result<ProtectedType, Exception> =
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
            Error(InvalidOperationException("cannot create ProtectedType") :> Exception)

type ProtectedId =
    | Folder of FolderId
    | Head of HeadId
    | Commit of CommitId
    | Submission of SubmissionId
    | Report of ReportId

    static member Create(id: string, typeName: string) =
        match ProtectedType.Create(typeName) with
            | Error(ex) -> Error(ex)
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
    abstract member CheckPermissions : ProtectedId * UserId * AccessModel -> Async<Result<unit, Exception>>
    abstract member CheckPermissions : GroupId * UserId * AccessModel -> Async<Result<unit, Exception>>
    abstract member Create : UserId * GroupName * GroupDescription -> Async<Result<GroupId, Exception>>
    abstract member SearchByContains : string -> Async<Result<List<GroupModel>, Exception>>
    abstract member Get : UserId * AccessModel -> Async<Result<List<GroupModel>, Exception>>
    abstract member Get : GroupId -> Async<Result<GroupModel, Exception>>
    abstract member Get : ProtectedId -> Async<Result<PermissionsModel, Exception>>
    abstract member Update : GroupId * Option<GroupName> * Option<GroupDescription> -> Async<Result<unit, Exception>>
    abstract member Remove : GroupId * UserId -> Async<Result<unit, Exception>>
    abstract member Update : GroupId * UserId * AccessModel -> Async<Result<unit, Exception>>
    abstract member Add : GroupId * UserId -> Async<Result<unit, Exception>>
    abstract member Update : ProtectedId * UserId * Option<AccessModel> -> Async<Result<unit, Exception>>
    abstract member Update : ProtectedId * GroupId * Option<AccessModel> -> Async<Result<unit, Exception>>
    abstract member Add : ProtectedId * UserId -> Async<Result<unit, Exception>>
    abstract member Add : ProtectedId * GroupId -> Async<Result<unit, Exception>>