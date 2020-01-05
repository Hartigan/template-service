import { FolderId, HeadId } from "../models/Identificators";
import { BehaviorSubject, Subject } from "rxjs";
import { FoldersService } from "../services/FoldersService";

export class FileExplorerState {
    private folder = new BehaviorSubject<FolderId | null>(null);
    private head = new BehaviorSubject<HeadId | null>(null);
    private folderChange = new Subject<FolderId>();
    private headChange = new Subject<HeadId>();
    private root : FolderId | null = null;

    constructor(private foldersService: FoldersService) {
    }

    folderUpdated() {
        return this.folderChange.asObservable();
    }

    syncFolder(id: FolderId) {
        this.folderChange.next(id);
    }

    headUpdated() {
        return this.headChange.asObservable();
    }

    syncHead(id: HeadId) {
        this.headChange.next(id);
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

    async currentFolderOrRoot() {
        if (this.currentFolder()) {
            return this.currentFolder();
        }

        if (!this.root) {
            let rootFolder = await this.foldersService.getRoot();
            this.root = rootFolder.id;
        }

        return this.root;
    }
}