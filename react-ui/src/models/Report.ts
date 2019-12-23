import { Permissions } from "./Permissions";

export interface ProblemReport {
    generated_problem_id: string;
    answer?: string;
    expected_answer: string;
    is_correct: boolean;
    timestamp: Date;
}

export interface Report {
    id: string;
    generated_problem_set_id: string;
    submission_id: string;
    permissions: Permissions;
    started_at: Date;
    finished_at: Date;
    answers: Array<ProblemReport>;
}