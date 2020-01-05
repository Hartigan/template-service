import { CommitId, TargetId, UserId, HeadId } from "./Identificators";

export interface Target {
    id: TargetId;
    type: "problem" | "problem_set";
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