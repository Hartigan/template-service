import { Permissions } from "./Permissions";
import { Commit } from "./Commit";

export interface Head {
    id: string;
    name: string;
    permissions: Permissions;
    commit: Commit;
}