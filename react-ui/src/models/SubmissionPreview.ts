import { SubmissionId, ReportId } from "./Identificators";
import { User } from "./User";

export interface SubmissionPreview {
    id: SubmissionId;
    started_at: Date;
    deadline: Date;
    title: string;
    completed: boolean;
    author: User;
}