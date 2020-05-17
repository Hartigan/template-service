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
        if typeName = Folder.TypeName then
            Ok(ProtectedType.Folder)
        elif typeName = Head.TypeName then
            Ok(ProtectedType.Head)
        elif typeName = Submission.TypeName then
            Ok(ProtectedType.Submission)
        elif typeName = Report.TypeName then
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
        | Folder(id) -> { ProtectedItem.Id = id.Value; Type = Folder.TypeName }
        | Head(id) -> { ProtectedItem.Id = id.Value; Type = Head.TypeName }
        | Submission(id) -> { ProtectedItem.Id = id.Value; Type = Submission.TypeName }
        | Report(id) -> { ProtectedItem.Id = id.Value; Type = Report.TypeName }

    static member Create(id: string, typeName: string) =
        match ProtectedType.Create(typeName) with
            | Error(ex) -> Error(ex)
            | Ok(protectedType) ->
                Ok(
                    match protectedType with
                    | ProtectedType.Folder -> ProtectedId.Folder(FolderId(id))
                    | ProtectedType.Head -> ProtectedId.Head(HeadId(id))
                    | ProtectedType.Submission -> ProtectedId.Submission(SubmissionId(id))
                    | ProtectedType.Report -> ProtectedId.Report(ReportId(id))
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
        let userId = UserId(userItems.UserId)
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
        let groupId = GroupId(groupItems.GroupId)
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
