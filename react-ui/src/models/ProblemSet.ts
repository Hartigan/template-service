import { ProblemSetId, HeadId } from "./Identificators";

export interface ProblemSlot {
    head_ids : Array<HeadId>;
}

export interface ProblemSet {
    id: ProblemSetId;
    title: string;
    slots: Array<ProblemSlot>;
    duration: number;
}