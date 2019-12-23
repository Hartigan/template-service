import { Permissions } from "./Permissions";

export interface FolderLink {
    id: string;
    name: string;
}

export interface HeadLink {
    id: string;
    name: string;
}

export interface Folder {
    id: string;
    name: string;
    folders: Array<FolderLink>;
    heads: Array<HeadLink>;
    permissions: Permissions;
}