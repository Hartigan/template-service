namespace Models.Identificators

open System
open Models.Converters
open System.Text.Json.Serialization

[<JsonConverter(typeof<FolderIdConverter>)>]
type FolderId(id: string) =
    member val Value = id with get

    override this.GetHashCode() = id.GetHashCode()
    override this.Equals(obj) =
        match obj with
        | :? FolderId as folderId -> (this.Value) = (folderId.Value)
        | _ -> false

    static member (==) (l : FolderId, r : FolderId) =
        l.Equals(r)

    static member (!=) (l : FolderId, r : FolderId) =
        not (l.Equals(r))

and FolderIdConverter() =
    inherit StringConverter<FolderId>((fun m -> m.Value), (fun s -> FolderId(s)))

[<JsonConverter(typeof<HeadIdConverter>)>]
type HeadId(id: string) =
    member val Value = id with get

    override this.GetHashCode() = id.GetHashCode()
    override this.Equals(b) =
        match b with
        | :? HeadId as headId -> (this.Value) = (headId.Value)
        | _ -> false

    static member (==) (l : HeadId, r : HeadId) =
        l.Equals(r)

    static member (!=) (l : HeadId, r : HeadId) =
        not (l.Equals(r))

and HeadIdConverter() =
    inherit StringConverter<HeadId>((fun m -> m.Value), (fun s -> HeadId(s)))

[<JsonConverter(typeof<UserIdConverter>)>]
type UserId(id: string) =
    member val Value = id with get

    override this.GetHashCode() = id.GetHashCode()
    override this.Equals(b) =
        match b with
        | :? UserId as userId -> (this.Value) = (userId.Value)
        | _ -> false

    static member (==) (l : UserId, r : UserId) =
        l.Equals(r)

    static member (!=) (l : UserId, r : UserId) =
        not (l.Equals(r))

and UserIdConverter() =
    inherit StringConverter<UserId>((fun m -> m.Value), (fun s -> UserId(s)))

[<JsonConverter(typeof<ProblemIdConverter>)>]
type ProblemId(id: string) =
    member val Value = id with get

    override this.GetHashCode() = id.GetHashCode()
    override this.Equals(b) =
        match b with
        | :? ProblemId as problemId -> (this.Value) = (problemId.Value)
        | _ -> false

    static member (==) (l : ProblemId, r : ProblemId) =
        l.Equals(r)

    static member (!=) (l : ProblemId, r : ProblemId) =
        not (l.Equals(r))

and ProblemIdConverter() =
    inherit StringConverter<ProblemId>((fun m -> m.Value), (fun s -> ProblemId(s)))

[<JsonConverter(typeof<GeneratedProblemIdConverter>)>]
type GeneratedProblemId(id: string) =
    member val Value = id with get

    override this.GetHashCode() = id.GetHashCode()
    override this.Equals(b) =
        match b with
        | :? GeneratedProblemId as generatedProblemId -> (this.Value) = (generatedProblemId.Value)
        | _ -> false

    static member (==) (l : GeneratedProblemId, r : GeneratedProblemId) =
        l.Equals(r)

    static member (!=) (l : GeneratedProblemId, r : GeneratedProblemId) =
        not (l.Equals(r))

and GeneratedProblemIdConverter() =
    inherit StringConverter<GeneratedProblemId>((fun m -> m.Value), (fun s -> GeneratedProblemId(s)))

[<JsonConverter(typeof<TargetIdConverter>)>]
type TargetId(id: string) =
    member val Value = id with get

    override this.GetHashCode() = id.GetHashCode()
    override this.Equals(b) =
        match b with
        | :? TargetId as targetId -> (this.Value) = (targetId.Value)
        | _ -> false

    static member (==) (l : TargetId, r : TargetId) =
        l.Equals(r)

    static member (!=) (l : TargetId, r : TargetId) =
        not (l.Equals(r))

and TargetIdConverter() =
    inherit StringConverter<TargetId>((fun m -> m.Value), (fun s -> TargetId(s)))

[<JsonConverter(typeof<CommitIdConverter>)>]
type CommitId(id: string) =
    member val Value = id with get

    override this.GetHashCode() = id.GetHashCode()
    override this.Equals(b) =
        match b with
        | :? CommitId as commitId -> (this.Value) = (commitId.Value)
        | _ -> false

    static member (==) (l : CommitId, r : CommitId) =
        l.Equals(r)

    static member (!=) (l : CommitId, r : CommitId) =
        not (l.Equals(r))

and CommitIdConverter() =
    inherit StringConverter<CommitId>((fun m -> m.Value), (fun s -> CommitId(s)))

[<JsonConverter(typeof<ProblemSetIdConverter>)>]
type ProblemSetId(id: string) =
    member val Value = id with get

    override this.GetHashCode() = id.GetHashCode()
    override this.Equals(b) =
        match b with
        | :? ProblemSetId as problemSetId -> (this.Value) = (problemSetId.Value)
        | _ -> false

    static member (==) (l : ProblemSetId, r : ProblemSetId) =
        l.Equals(r)

    static member (!=) (l : ProblemSetId, r : ProblemSetId) =
        not (l.Equals(r))

and ProblemSetIdConverter() =
    inherit StringConverter<ProblemSetId>((fun m -> m.Value), (fun s -> ProblemSetId(s)))

[<JsonConverter(typeof<GeneratedProblemSetIdConverter>)>]
type GeneratedProblemSetId(id: string) =
    member val Value = id with get

    override this.GetHashCode() = id.GetHashCode()
    override this.Equals(b) =
        match b with
        | :? GeneratedProblemSetId as generatedProblemSetId -> (this.Value) = (generatedProblemSetId.Value)
        | _ -> false

    static member (==) (l : GeneratedProblemSetId, r : GeneratedProblemSetId) =
        l.Equals(r)

    static member (!=) (l : GeneratedProblemSetId, r : GeneratedProblemSetId) =
        not (l.Equals(r))

and GeneratedProblemSetIdConverter() =
    inherit StringConverter<GeneratedProblemSetId>((fun m -> m.Value), (fun s -> GeneratedProblemSetId(s)))