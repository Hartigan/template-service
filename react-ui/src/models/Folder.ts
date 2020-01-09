import { Permissions } from "./Permissions";
import { FolderId, HeadId } from "./Identificators";
import { TargetType } from "./Commit";
import { Head } from "./Head";

export interface FolderLink {
    id: FolderId;
    name: string;
}

export interface HeadLink {
    id: HeadId;
    name: string;
    type: TargetType;
}

export function fromHead(head: Head) : HeadLink {
    return {
        id: head.id,
        name: head.name,
        type: head.commit.target.type,
    };
}

export interface Folder {
    id: FolderId;
    name: string;
    folders: Array<FolderLink>;
    heads: Array<HeadLink>;
    permissions: Permissions;
}