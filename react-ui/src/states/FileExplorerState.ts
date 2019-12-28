import { FolderId, HeadId } from "../models/Identificators";
import { BehaviorSubject, Subject } from "rxjs";

export class FileExplorerState {
    private folder = new BehaviorSubject<FolderId | null>(null);
    private head = new BehaviorSubject<HeadId | null>(null);
    private folderChange = new Subject<FolderId>();

    constructor() {
    }

    folderUpdated() {
        return this.folderChange.asObservable();
    }

    syncFolder(id: FolderId) {
        this.folderChange.next(id);
    }

    setCurrentFolder(folderId: FolderId) {
        this.folder.next(folderId);
    }

    currentFolder() {
        return this.folder.getValue();
    }

    currentFolderChanged() {
        return this.folder.asObservable();
    }

    setCurrentHead(headId: HeadId) {
        this.head.next(headId);
    }

    currentHead() {
        return this.head.getValue();
    }

    currentHeadChanged() {
        return this.head.asObservable();
    }
}