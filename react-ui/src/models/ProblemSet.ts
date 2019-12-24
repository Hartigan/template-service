import { ProblemSetId, HeadId } from "./Identificators";

export interface ProblemSet {
    id: ProblemSetId;
    title: string;
    head_ids: Array<HeadId>;
    duration: number;
}