namespace Models.Permissions

open DatabaseTypes
open DatabaseTypes.Identificators
open System.Text.Json.Serialization
open System
open Utils.ResultHelper

type ProtectedType =
    | Folder
    | Head
    | Submission
    | Report
    static member Create(typeName: string) : Result<ProtectedType, Exception> =
        if typeName = FolderType.Instance.Value then
            Ok(ProtectedType.Folder)
        elif typeName = HeadType.Instance.Value then
            Ok(ProtectedType.Head)
        elif typeName = SubmissionType.Instance.Value then
            Ok(ProtectedType.Submission)
        elif typeName = ReportType.Instance.Value then
            Ok(ProtectedType.Report)
        else
            Error(InvalidOperationException("cannot create ProtectedType") :> Exception)

type ProtectedId =
    | Folder of FolderId
    | Head of HeadId
    | Submission of SubmissionId
    | Report of ReportId

    static member Create(id: string, typeName: string) =
        match ProtectedType.Create(typeName) with
            | Error(ex) -> Error(ex)
            | Ok(protectedType) ->
                Ok(
                    match protectedType with
                    | ProtectedType.Folder(_) -> ProtectedId.Folder(FolderId(id))
                    | ProtectedType.Head(_) -> ProtectedId.Head(HeadId(id))
                    | ProtectedType.Submission(_) -> ProtectedId.Submission(SubmissionId(id))
                    | ProtectedType.Report(_) -> ProtectedId.Report(ReportId(id))
                )

type ProtectedItemsModel =
    {
        [<JsonPropertyName("heads")>]
        Heads : List<HeadId>
        [<JsonPropertyName("folders")>]
        Folders : List<FolderId>
        [<JsonPropertyName("submissions")>]
        Submissions : List<SubmissionId>
        [<JsonPropertyName("reports")>]
        Reports : List<ReportId>
    }

    static member Create(entity: ProtectedItems) : ProtectedItemsModel =
        {
            Heads = entity.Heads
            Folders = entity.Folders
            Submissions = entity.Submissions
            Reports = entity.Reports
        }

type UserItemsModel =
    {
        [<JsonPropertyName("user_id")>]
        UserId: UserId
        [<JsonPropertyName("allowed")>]
        Allowed: ProtectedItemsModel
        [<JsonPropertyName("owned")>]
        Owned: ProtectedItemsModel
    }

    static member Create(userItems: UserItems) : UserItemsModel =
        {
            UserId = userItems.UserId
            Allowed = ProtectedItemsModel.Create(userItems.Allowed)
            Owned = ProtectedItemsModel.Create(userItems.Owned)
        }
        

type GroupItemsModel =
    {
        [<JsonPropertyName("group_id")>]
        GroupId: GroupId
        [<JsonPropertyName("allowed")>]
        Allowed: ProtectedItemsModel
    }

    static member Create(groupItems: GroupItems) : GroupItemsModel =
        {
            GroupId = groupItems.GroupId
            Allowed = ProtectedItemsModel.Create(groupItems.Allowed)
        }
