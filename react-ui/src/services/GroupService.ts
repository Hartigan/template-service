import { GlobalSettings } from '../settings/GlobalSettings'
import { BaseService } from './BaseService';
import { GroupsServiceClient } from '../protobuf/GroupsServiceClientPb';
import { AuthService } from './AuthService';
import { CreateGroupRequest, GetGroupRequest, GetGroupsRequest, UpdateGroupRequest, UpdateMemberRequest, RemoveMembersRequest, AddMembersRequest, SearchRequest, UpdateMemberReply, AddMembersReply, CreateGroupReply, GetGroupReply, GetGroupsReply, RemoveMembersReply, SearchReply, UpdateGroupReply } from '../protobuf/groups_pb';


export class GroupService extends BaseService<GroupsServiceClient> {

    constructor(authService: AuthService) {
        super(authService, new GroupsServiceClient(GlobalSettings.ApiBaseUrl));
    }

    createGroup(request: CreateGroupRequest) {
        return this.doCall<CreateGroupRequest, CreateGroupReply>(this.client.createGroup)(request);
    }

    getGroup(request: GetGroupRequest) {
        return this.doCall<GetGroupRequest, GetGroupReply>(this.client.getGroup)(request);
    }

    getGroups(request: GetGroupsRequest) {
        return this.doCall<GetGroupsRequest, GetGroupsReply>(this.client.getGroups)(request);
    }

    updateGroup(request: UpdateGroupRequest) {
        return this.doCall<UpdateGroupRequest, UpdateGroupReply>(this.client.updateGroup)(request);
    }

    updateMember(request: UpdateMemberRequest) {
        return this.doCall<UpdateMemberRequest, UpdateMemberReply>(this.client.updateMember)(request);
    }

    removeMembers(request: RemoveMembersRequest) {
        return this.doCall<RemoveMembersRequest, RemoveMembersReply>(this.client.removeMembers)(request);
    }

    addMembers(request: AddMembersRequest) {
        return this.doCall<AddMembersRequest, AddMembersReply>(this.client.addMembers)(request);
    }

    search(request: SearchRequest) {
        return this.doCall<SearchRequest, SearchReply>(this.client.search)(request);
    }
}
