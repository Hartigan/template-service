import { Permissions } from "./Permissions";

export interface ProblemAnswer {
    generated_problem_id: string;
    answer: string;
    timestamp: Date;
}

export interface Submission {
    id: string;
    generated_problem_set_id: string;
    permissions: Permissions;
    started_at: Date;
    deadline: Date;
    answers: Array<ProblemAnswer>;
    completed: boolean;
    report_id?: string;
}