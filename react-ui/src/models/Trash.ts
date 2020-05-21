import { HeadId, FolderId } from "./Identificators";
import { TargetType } from "./Commit";

export interface TrashHeadEntry {
    head_id: HeadId;
    name: string;
    type: TargetType;
}

export interface TrashFolderEntry {
    folder_id: FolderId;
    name: string;
}

export interface Trash {
    heads: Array<TrashHeadEntry>;
    folders: Array<TrashFolderEntry>;
}