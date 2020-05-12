import { GeneratedProblemId, ReportId, SubmissionId, GeneratedProblemSetId } from "./Identificators";
import { GeneratedView } from "./GeneratedView";
import { User } from "./User";

export interface ProblemAnswer {
    generated_problem_id: GeneratedProblemId;
    answer: string;
}

export interface SubmissionProblem {
    id: GeneratedProblemId;
    title: string;
    view: GeneratedView;
}

export interface SubmissionProblemSet {
    id: GeneratedProblemSetId;
    title: string;
    problems: Array<SubmissionProblem>;
}

export interface Submission {
    id: SubmissionId;
    problem_set: SubmissionProblemSet;
    started_at: Date;
    deadline: Date;
    answers: Array<ProblemAnswer>;
    completed: boolean;
    report_id?: ReportId;
    author: User;
}