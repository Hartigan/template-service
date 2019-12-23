import { GeneratedView } from "./GeneratedView";

export interface GeneratedProblem {
    id: string;
    problem_id: string;
    seed: number;
    title: string;
    view: GeneratedView;
    answer: string;
}