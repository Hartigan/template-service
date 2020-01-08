import { Permissions } from "./Permissions";
import { FolderId, HeadId } from "./Identificators";
import { TargetType } from "./Commit";

export interface FolderLink {
    id: FolderId;
    name: string;
}

export interface HeadLink {
    id: HeadId;
    name: string;
    type: TargetType;
}

export interface Folder {
    id: FolderId;
    name: string;
    folders: Array<FolderLink>;
    heads: Array<HeadLink>;
    permissions: Permissions;
}