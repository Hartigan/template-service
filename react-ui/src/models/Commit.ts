export interface Target {
    id: string;
    type: string;
}

export interface Commit {
    id: string;
    author_id: string;
    head_id: string;
    target: Target;
    timestamp: Date;
    parent_id: string;
    description: string;
}