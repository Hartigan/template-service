import { GeneratedProblemId, ReportId, SubmissionId } from "./Identificators";
import { GeneratedProblemSet } from "./GeneratedProblemSet";

export interface ProblemAnswer {
    generated_problem_id: GeneratedProblemId;
    answer: string;
    timestamp: Date;
}

export interface Submission {
    id: SubmissionId;
    generated_problem_set: GeneratedProblemSet;
    started_at: Date;
    deadline: Date;
    answers: Array<ProblemAnswer>;
    completed: boolean;
    report_id?: ReportId;
}