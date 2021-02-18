import { FoldersServiceClient } from '../protobuf/FoldersServiceClientPb';
import { GetFoldersRequest, CreateFolderRequest, GetRootRequest, GetTrashRequest, MoveToTrashRequest, RestoreFromTrashRequest, MoveRequest, RenameRequest, GetFoldersReply, CreateFolderReply, GetRootReply, GetTrashReply, MoveReply, MoveToTrashReply, RenameReply, RestoreFromTrashReply } from '../protobuf/folders_pb';
import { GlobalSettings } from '../settings/GlobalSettings'
import { AuthService } from './AuthService';
import { BaseService } from './BaseService';

export class FoldersService extends BaseService<FoldersServiceClient> {

    constructor(authService: AuthService) {
        super(authService, new FoldersServiceClient(GlobalSettings.ApiBaseUrl));
    }

    getFolders(request: GetFoldersRequest) {
        return this.doCall<GetFoldersRequest, GetFoldersReply>(this.client.getFolders)(request);
    }

    createFolder(request: CreateFolderRequest) {
        return this.doCall<CreateFolderRequest, CreateFolderReply>(this.client.createFolder)(request);
    }

    getRoot(request: GetRootRequest) {
        return this.doCall<GetRootRequest, GetRootReply>(this.client.getRoot)(request);
    }

    getTrash(request: GetTrashRequest) {
        return this.doCall<GetTrashRequest, GetTrashReply>(this.client.getTrash)(request);
    }

    moveToTrash(request: MoveToTrashRequest) {
        return this.doCall<MoveToTrashRequest, MoveToTrashReply>(this.client.moveToTrash)(request);
    }

    restoreFromTrash(request: RestoreFromTrashRequest) {
        return this.doCall<RestoreFromTrashRequest, RestoreFromTrashReply>(this.client.restoreFromTrash)(request);
    }

    move(request: MoveRequest) {
        return this.doCall<MoveRequest, MoveReply>(this.client.move)(request);
    }

    rename(request: RenameRequest) {
        return this.doCall<RenameRequest, RenameReply>(this.client.rename)(request);
    }
}

