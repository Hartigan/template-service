import { GlobalSettings } from '../settings/GlobalSettings'
import { HttpService } from './HttpService';
import { Folder } from '../models/Folder';
import { FolderId, Id, HeadId } from '../models/Identificators';
import { HttpServiceFactory } from './HttpServiceFactory';

export class FoldersService {
    private http : HttpService;

    constructor(httpServiceFactory: HttpServiceFactory) {
        this.http = httpServiceFactory.create(`${GlobalSettings.ApiBaseUrl}/folders`);
    }

    getFolder(folderId: FolderId) {
        return this.http.get<Folder>(`get?folder_id=${folderId}`);
    }

    createFolder(name: string) {
        return this.http.post<Id<FolderId>>(`create_folder`, { name: name });
    }

    addFolder(targetId: FolderId, destinationId: FolderId) {
        return this.http.post<void>(`add_folder`, { target_id: targetId, destination_id: destinationId });
    }

    addHead(targetId: HeadId, destinationId: FolderId) {
        return this.http.post<void>(`add_head`, { target_id: targetId, destination_id: destinationId })
    }

    getRoot() {
        return this.http.get<Folder>(`get_root`);
    }

    moveHeadToTrash(id: HeadId) {
        return this.http.post<void>(`move_head_to_trash`, { target_id: id });
    }

    moveFolderToTrash(id: FolderId) {
        return this.http.post<void>(`move_folder_to_trash`, { target_id: id });
    }

    renameFolder(id: FolderId, name: string) {
        return this.http.post<void>(`rename_folder`, { target_id: id, name: name });
    }

    renameFolderLink(parentId: FolderId, linkId: FolderId, name: string) {
        return this.http.post<void>(`rename_folder_link`, { parent_id: parentId, link_id: linkId, name: name });
    }

    renameHeadLink(parentId: FolderId, linkId: HeadId, name: string) {
        return this.http.post<void>(`rename_head_link`, { parent_id: parentId, link_id: linkId, name: name });
    }
}

