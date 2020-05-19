import { GeneratedProblemSetId } from "./Identificators";

export interface GeneratedProblemSet {
    id: GeneratedProblemSetId;
    seed: number;
    title: string;
    problems: Array<string>;
    duration: number;
}