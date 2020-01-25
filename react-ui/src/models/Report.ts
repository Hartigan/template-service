import { GeneratedProblemId, GeneratedProblemSetId, SubmissionId } from "./Identificators";

export interface ProblemReport {
    generated_problem_id: GeneratedProblemId;
    answer?: string;
    expected_answer: string;
    is_correct: boolean;
    timestamp: Date;
}

export interface Report {
    id: string;
    generated_problem_set_id: GeneratedProblemSetId;
    submission_id: SubmissionId;
    started_at: Date;
    finished_at: Date;
    answers: Array<ProblemReport>;
}