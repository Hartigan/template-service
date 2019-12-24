import { GlobalSettings } from '../settings/GlobalSettings'
import { HttpService } from './HttpService';
import { Folder } from '../models/Folder';
import { FolderId, Id } from '../models/Identificators';

export class FoldersService {
    private http = new HttpService(`${GlobalSettings.ApiBaseUrl}/folders`);

    constructor() {
    }

    getFolder(folderId: string) {
        return this.http.get<Folder>(`get?folder_id=${folderId}`);
    }

    createFolder(name: string) {
        return this.http.post<Id<FolderId>>(`create_folder`, { name: name });
    }

    addFolder(targetId: string, destinationId: string) {
        return this.http.post<void>(`add_folder`, { target_id: targetId, destination_id: destinationId });
    }

    addHead(targetId: string, destinationId: string) {
        return this.http.post<void>(`add_head`, { target_id: targetId, destination_id: destinationId })
    }

    getRoot() {
        return this.http.get<Folder>(`get_root`);
    }

    moveHeadToTrash(id: string) {
        return this.http.post<void>(`move_head_to_trash`, { target_id: id });
    }

    moveFolderToTrash(id: string) {
        return this.http.post<void>(`move_folder_to_trash`, { target_id: id });
    }

    renameFolder(id: string, name: string) {
        return this.http.post<void>(`rename_folder`, { target_id: id, name: name });
    }

    renameFolderLink(parentId: string, linkId: string, name: string) {
        return this.http.post<void>(`rename_folder_link`, { parent_id: parentId, link_id: linkId, name: name });
    }

    renameHeadLink(parentId: string, linkId: string, name: string) {
        return this.http.post<void>(`rename_head_link`, { parent_id: parentId, link_id: linkId, name: name });
    }
}

