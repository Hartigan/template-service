import { GeneratedView } from "./GeneratedView";
import { GeneratedProblemId, ProblemId } from "./Identificators";

export interface GeneratedProblem {
    id: GeneratedProblemId;
    problem_id: ProblemId;
    seed: number;
    title: string;
    view: GeneratedView;
    answer: string;
}