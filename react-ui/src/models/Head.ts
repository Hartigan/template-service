import { Permissions } from "./Permissions";
import { Commit } from "./Commit";
import { HeadId } from "./Identificators";

export interface Head {
    id: HeadId;
    name: string;
    permissions: Permissions;
    commit: Commit;
}