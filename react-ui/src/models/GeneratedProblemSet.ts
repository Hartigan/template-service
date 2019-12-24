import { GeneratedProblemSetId } from "./Identificators";

export interface GeneratedProblemSet {
    id: GeneratedProblemSetId;
    title: string;
    problems: Array<string>;
    duration: number;
}