import { PermissionsServiceClient } from '../protobuf/PermissionsServiceClientPb';
import { AddMembersReply, AddMembersRequest, GetAccessInfoReply, GetAccessInfoRequest, GetPermissionsReply, GetPermissionsRequest, RemoveMembersReply, RemoveMembersRequest, SetIsPublicReply, SetIsPublicRequest, UpdatePermissionsReply, UpdatePermissionsRequest } from '../protobuf/permissions_pb';
import { GlobalSettings } from '../settings/GlobalSettings'
import { AuthService } from './AuthService';
import { BaseService } from './BaseService';

export class PermissionsService extends BaseService<PermissionsServiceClient> {

    constructor(authService: AuthService) {
        super(authService, new PermissionsServiceClient(GlobalSettings.ApiBaseUrl));
    }

    getPermissions(request: GetPermissionsRequest) {
        return this.doCall<GetPermissionsRequest, GetPermissionsReply>(this.client.getPermissions)(request);
    }

    setIsPublic(request: SetIsPublicRequest) {
        return this.doCall<SetIsPublicRequest, SetIsPublicReply>(this.client.setIsPublic)(request);
    }

    getAccessInfo(request: GetAccessInfoRequest) {
        return this.doCall<GetAccessInfoRequest, GetAccessInfoReply>(this.client.getAccessInfo)(request);
    }

    updatePermissions(request: UpdatePermissionsRequest) {
        return this.doCall<UpdatePermissionsRequest, UpdatePermissionsReply>(this.client.updatePermissions)(request);
    }

    addMembers(request: AddMembersRequest) {
        return this.doCall<AddMembersRequest, AddMembersReply>(this.client.addMembers)(request);
    }

    removeMembers(request: RemoveMembersRequest) {
        return this.doCall<RemoveMembersRequest, RemoveMembersReply>(this.client.removeMembers)(request);
    }
}
