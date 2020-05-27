import { Commit } from "./Commit";
import { HeadId } from "./Identificators";

export interface Head {
    id: HeadId;
    name: string;
    commit: Commit;
    tags: Array<string>;
}