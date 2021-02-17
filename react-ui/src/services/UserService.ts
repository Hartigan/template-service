import { UsersServiceClient } from '../protobuf/UsersServiceClientPb';
import { InitRequest, GetUserRequest, GetUserReply, InitReply, SearchRequest, SearchReply } from '../protobuf/users_pb';
import { GlobalSettings } from '../settings/GlobalSettings'
import { AuthService } from './AuthService';
import { BaseService } from './BaseService';

export class UserService extends BaseService<UsersServiceClient> {

    constructor(authService: AuthService) {
        super(authService, new UsersServiceClient(GlobalSettings.ApiBaseUrl));
    }

    init(request: InitRequest) {
        return this.doCall<InitRequest, InitReply>(this.client.init)(request);
    }

    getUser(request: GetUserRequest) {
        return this.doCall<GetUserRequest, GetUserReply>(this.client.getUser)(request);
    }

    search(request: SearchRequest) {
        return this.doCall<SearchRequest, SearchReply>(this.client.search)(request);
    }
}