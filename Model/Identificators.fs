namespace Models.Identificators

open System
open Models.Converters
open System.Text.Json.Serialization

[<JsonConverter(typeof<FolderIdConverter>)>]
type FolderId = 
    | FolderId of id: string
    member this.Value = 
        match this with
        | FolderId(id) -> id

and FolderIdConverter() =
    inherit StringConverter<FolderId>((fun m -> m.Value), (fun s -> FolderId(s)))

[<JsonConverter(typeof<HeadIdConverter>)>]
type HeadId = 
    | HeadId of id: string
    member this.Value = 
        match this with
        | HeadId(id) -> id

and HeadIdConverter() =
    inherit StringConverter<HeadId>((fun m -> m.Value), (fun s -> HeadId(s)))

[<JsonConverter(typeof<UserIdConverter>)>]
type UserId = 
    | UserId of id: string
    member this.Value = 
        match this with
        | UserId(id) -> id

and UserIdConverter() =
    inherit StringConverter<UserId>((fun m -> m.Value), (fun s -> UserId(s)))

[<JsonConverter(typeof<ProblemIdConverter>)>]
type ProblemId = 
    | ProblemId of id: string
    member this.Value = 
        match this with
        | ProblemId(id) -> id

and ProblemIdConverter() =
    inherit StringConverter<ProblemId>((fun m -> m.Value), (fun s -> ProblemId(s)))

[<JsonConverter(typeof<GeneratedProblemIdConverter>)>]
type GeneratedProblemId =
    | GeneratedProblemId of id: string
    member this.Value = 
        match this with
        | GeneratedProblemId(id) -> id

and GeneratedProblemIdConverter() =
    inherit StringConverter<GeneratedProblemId>((fun m -> m.Value), (fun s -> GeneratedProblemId(s)))

[<JsonConverter(typeof<TargetIdConverter>)>]
type TargetId = 
    | TargetId of id: string
    member this.Value = 
        match this with
        | TargetId(id) -> id

and TargetIdConverter() =
    inherit StringConverter<TargetId>((fun m -> m.Value), (fun s -> TargetId(s)))

[<JsonConverter(typeof<CommitIdConverter>)>]
type CommitId = 
    | CommitId of id: string
    member this.Value = 
        match this with
        | CommitId(id) -> id

and CommitIdConverter() =
    inherit StringConverter<CommitId>((fun m -> m.Value), (fun s -> CommitId(s)))

[<JsonConverter(typeof<ProblemSetIdConverter>)>]
type ProblemSetId = 
    | ProblemSetId of id: string
    member this.Value = 
        match this with
        | ProblemSetId(id) -> id

and ProblemSetIdConverter() =
    inherit StringConverter<ProblemSetId>((fun m -> m.Value), (fun s -> ProblemSetId(s)))

[<JsonConverter(typeof<GeneratedProblemSetIdConverter>)>]
type GeneratedProblemSetId = 
    | GeneratedProblemSetId of id: string
    member this.Value = 
        match this with
        | GeneratedProblemSetId(id) -> id

and GeneratedProblemSetIdConverter() =
    inherit StringConverter<GeneratedProblemSetId>((fun m -> m.Value), (fun s -> GeneratedProblemSetId(s)))

[<JsonConverter(typeof<SubmissionIdConverter>)>]
type SubmissionId = 
    | SubmissionId of id: string
    member this.Value = 
        match this with
        | SubmissionId(id) -> id

and SubmissionIdConverter() =
    inherit StringConverter<SubmissionId>((fun m -> m.Value), (fun s -> SubmissionId(s)))

[<JsonConverter(typeof<ReportIdConverter>)>]
type ReportId = 
    | ReportId of id: string
    member this.Value = 
        match this with
        | ReportId(id) -> id

and ReportIdConverter() =
    inherit StringConverter<ReportId>((fun m -> m.Value), (fun s -> ReportId(s)))

type Id<'T>(id: 'T) =
    [<JsonPropertyName("id")>]
    member val Value = id