import { CommitId, TargetId, UserId, HeadId } from "./Identificators";

export type TargetType = "problem" | "problem_set"

export interface Target {
    id: TargetId;
    type: TargetType;
}

export interface Commit {
    id: CommitId;
    author_id: UserId;
    head_id: HeadId;
    target: Target;
    timestamp: Date;
    parent_id: CommitId;
    description: string;
}