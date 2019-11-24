namespace Models.Identificators

open System
open Models.Converters

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

type FolderIdConverter() =
    inherit StringConverter<FolderId>((fun m -> m.Value), (fun s -> FolderId(s)))

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

type HeadIdConverter() =
    inherit StringConverter<HeadId>((fun m -> m.Value), (fun s -> HeadId(s)))

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

type UserIdConverter() =
    inherit StringConverter<UserId>((fun m -> m.Value), (fun s -> UserId(s)))

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

type ProblemIdConverter() =
    inherit StringConverter<ProblemId>((fun m -> m.Value), (fun s -> ProblemId(s)))
