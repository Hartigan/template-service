import { Permissions } from "./Permissions";
import { GeneratedProblemId, GeneratedProblemSetId, ReportId, SubmissionId } from "./Identificators";

export interface ProblemAnswer {
    generated_problem_id: GeneratedProblemId;
    answer: string;
    timestamp: Date;
}

export interface Submission {
    id: SubmissionId;
    generated_problem_set_id: GeneratedProblemSetId;
    permissions: Permissions;
    started_at: Date;
    deadline: Date;
    answers: Array<ProblemAnswer>;
    completed: boolean;
    report_id?: ReportId;
}