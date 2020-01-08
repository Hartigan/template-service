import { FolderId, HeadId } from "../models/Identificators";
import { Subject } from "rxjs";
import { FoldersService } from "../services/FoldersService";
import { FolderLink, HeadLink } from "../models/Folder";

export class FileExplorerState {
    private curFolder : FolderLink | null = null;
    private folder = new Subject<FolderLink | null>();
    private curHead : HeadLink | null = null;
    private head = new Subject<HeadLink | null>();
    private folderChange = new Subject<FolderId>();
    private headChange = new Subject<HeadId>();
    private root : FolderLink | null = null;

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

    setCurrentFolder(link: FolderLink) {
        this.curFolder = link;
        this.folder.next(link);
    }

    currentFolder() {
        return this.curFolder;
    }

    currentFolderChanged() {
        return this.folder.asObservable();
    }

    setCurrentHead(link: HeadLink) {
        this.curHead = link;
        this.head.next(link);
    }

    currentHead() {
        return this.curHead;
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
            this.root = { id: rootFolder.id, name: rootFolder.name };
        }

        return this.root;
    }
}