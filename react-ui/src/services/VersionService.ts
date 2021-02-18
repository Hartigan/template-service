import { GlobalSettings } from '../settings/GlobalSettings'
import { AuthService } from './AuthService';
import { VersionServiceClient } from '../protobuf/VersionServiceClientPb';
import { GetCommitReply, GetCommitRequest, GetHeadsReply, GetHeadsRequest, SearchReply, SearchRequest, UpdateTagsReply, UpdateTagsRequest } from '../protobuf/version_pb';
import { BaseService } from './BaseService';

export class VersionService extends BaseService<VersionServiceClient> {

    constructor(authService: AuthService) {
        super(authService, new VersionServiceClient(GlobalSettings.ApiBaseUrl));
    }

    getHeads(request: GetHeadsRequest) {
        return this.doCall<GetHeadsRequest, GetHeadsReply>(this.client.getHeads)(request);
    }

    getCommit(request: GetCommitRequest) {
        return this.doCall<GetCommitRequest, GetCommitReply>(this.client.getCommit)(request)
    }

    updateTags(request: UpdateTagsRequest) {
        return this.doCall<UpdateTagsRequest, UpdateTagsReply>(this.client.updateTags)(request);
    }

    search(request: SearchRequest) {
        return this.doCall<SearchRequest, SearchReply>(this.client.search)(request);
    }
}