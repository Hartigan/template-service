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

    member this.ToEntity() =
        match this with
        | Folder(id) -> { ProtectedItem.Id = id.Value; Type = FolderType.Instance.Value }
        | Head(id) -> { ProtectedItem.Id = id.Value; Type = HeadType.Instance.Value }
        | Submission(id) -> { ProtectedItem.Id = id.Value; Type = SubmissionType.Instance.Value }
        | Report(id) -> { ProtectedItem.Id = id.Value; Type = ReportType.Instance.Value }

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

    static member Create(protectedItem: ProtectedItem) =
        ProtectedId.Create(protectedItem.Id, protectedItem.Type)


type UserItemsModel =
    {
        [<JsonPropertyName("user_id")>]
        UserId: UserId
        [<JsonPropertyName("allowed")>]
        Allowed: List<ProtectedId>
        [<JsonPropertyName("owned")>]
        Owned: List<ProtectedId>
    }

    static member Create(userItems: UserItems) : Result<UserItemsModel, Exception> =
        let userId = userItems.UserId
        let allowedResult =
            userItems.Allowed
            |> Seq.map ProtectedId.Create
            |> ResultOfSeq

        let ownedResult =
            userItems.Owned
            |> Seq.map ProtectedId.Create
            |> ResultOfSeq
        
        match (allowedResult, ownedResult) with
        | (Ok(allowed), Ok(owned)) ->
            Ok({
                UserId = userId
                Allowed = allowed
                Owned = owned
            })
        | errors -> Error(ErrorOf2 errors)

type GroupItemsModel =
    {
        [<JsonPropertyName("group_id")>]
        GroupId: GroupId
        [<JsonPropertyName("allowed")>]
        Allowed: List<ProtectedId>
    }

    static member Create(groupItems: GroupItems) : Result<GroupItemsModel, Exception> =
        let groupId = groupItems.GroupId
        let allowedResult =
            groupItems.Allowed
            |> Seq.map ProtectedId.Create
            |> ResultOfSeq

        match allowedResult with
        | Ok(allowed) ->
            Ok({
                GroupId = groupId
                Allowed = allowed
            })
        | Error(error) -> Error(error)
