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

    createFolder(name: string, destinationId: FolderId) {
        return this.http.post<Id<FolderId>>(`create_folder`, { name: name, destination_id: destinationId });
    }

    getRoot() {
        return this.http.get<Folder>(`get_root`);
    }

    moveHeadToTrash(parentId: FolderId, headId: HeadId) {
        return this.http.post<void>(`move_head_to_trash`, { parent_id: parentId, target_id: headId });
    }

    moveFolderToTrash(parentId: FolderId, folderId: FolderId) {
        return this.http.post<void>(`move_folder_to_trash`, { parent_id: parentId, target_id: folderId });
    }

    renameFolder(parentId: FolderId, targetId: FolderId, name: string) {
        return this.http.post<void>(`rename_folder`, { parent_id: parentId, target_id: targetId, name: name });
    }

    renameHead(parentId: FolderId, headId: HeadId, name: string) {
        return this.http.post<void>(`rename_head`, { parent_id: parentId, head_id: headId, name: name });
    }
}

