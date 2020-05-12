import { GeneratedProblemId, GeneratedProblemSetId, SubmissionId } from "./Identificators";
import { GeneratedView } from "./GeneratedView";
import { User } from "./User";

export interface ProblemReport {
    id: GeneratedProblemId;
    title: string;
    view: GeneratedView;
    answer?: string;
    expected_answer: string;
    is_correct: boolean;
    timestamp?: Date;
}

export interface ProblemSetReport {
    id: GeneratedProblemSetId;
    title: string;
    problems: Array<ProblemReport>;
}

export interface Report {
    id: string;
    problem_set: ProblemSetReport;
    started_at: Date;
    finished_at: Date;
    author: User;
}