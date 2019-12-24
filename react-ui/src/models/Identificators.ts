export type FolderId = string;
export type HeadId = string;
export type UserId = string;
export type ProblemId = string;
export type GeneratedProblemId = string;
export type TargetId = string;
export type CommitId = string;
export type ProblemSetId = string;
export type GeneratedProblemSetId = string;
export type SubmissionId = string;
export type ReportId = string;

export interface Id<T> {
    id: T;
}