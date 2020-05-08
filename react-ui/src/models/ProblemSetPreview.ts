import { ProblemSetId } from "./Identificators";
import { User } from "./User";

export interface ProblemSetPreview {
    id: ProblemSetId;
    title: string;
    problems_count: number;
    duration: number;
    author: User;
}