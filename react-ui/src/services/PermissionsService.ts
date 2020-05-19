import { GlobalSettings } from '../settings/GlobalSettings'
import { HttpService } from './HttpService';
import { HttpServiceFactory } from './HttpServiceFactory';
import { Id, GroupId, FolderId, HeadId, SubmissionId, ReportId, UserId } from '../models/Identificators';
import { Group, Permissions, Access } from '../models/Permissions';

export type ProtectedType = "folder" | "head" | "commit" | "submission" | "report";
export type ProtectedId = FolderId | HeadId | SubmissionId | ReportId;
export interface Protected {
    id: ProtectedId;
    type: ProtectedType;
}

export class PermissionsService {
    private http : HttpService;

    constructor(httpServiceFactory: HttpServiceFactory) {
        this.http = httpServiceFactory.create(`${GlobalSettings.ApiBaseUrl}/permissions`);
    }

    createGroup(name: string, description: string) {
        return this.http.post<Id<GroupId>>(`create_group`, { name: name, description: description });
    }

    getGroup(id: GroupId) {
        return this.http.get<Group>(`group?id=${id}`);
    }

    getGroups(access: Access) {
        return this.http.get<Array<Group>>(`groups?admin=${access.admin}&read=${access.read}&write=${access.write}&generate=${access.generate}`);
    }

    getPermissions(item: Protected) {
        return this.http.get<Permissions>(`permissions?id=${item.id}&type=${item.type}`);
    }

    updateGroupName(id: GroupId, userId: UserId, name: string) {
        return this.http.post<void>(`update_group_name`, { id: id, user_id: userId, name: name });
    }

    updateGroupDescription(id: GroupId, userId: UserId, description: string) {
        return this.http.post<void>(`update_group_description`, { id: id, user_id: userId, description: description });
    }

    updateGroupMember(id: GroupId, userId: UserId, access: Access) {
        return this.http.post<void>(`update_group_member`, { id: id, user_id: userId, access: access });
    }

    removeGroupMember(id: GroupId, userId: UserId) {
        return this.http.post<void>(`remove_group_member`, { id: id, user_id: userId });
    }

    addGroupMember(id: GroupId, userId: UserId) {
        return this.http.post<void>(`add_group_member`, { id: id, user_id: userId });
    }

    updatePermissionsGroup(item: Protected, groupId: GroupId, access: Access) {
        return this.http.post<void>(`update_permissions_group?id=${item.id}&type=${item.type}`, { group_id: groupId, access: access });
    }

    removePermissionsGroup(item: Protected, groupId: GroupId) {
        return this.http.post<void>(`remove_permissions_group?id=${item.id}&type=${item.type}`, { group_id: groupId });
    }

    addPermissionsGroup(item: Protected, groupId: GroupId) {
        return this.http.post<void>(`add_permissions_group?id=${item.id}&type=${item.type}`, { group_id: groupId });
    }

    updatePermissionsMember(item: Protected, userId: UserId, access: Access) {
        return this.http.post<void>(`update_permissions_member?id=${item.id}&type=${item.type}`, { user_id: userId, access: access });
    }

    removePermissionsMember(item: Protected, userId: GroupId) {
        return this.http.post<void>(`remove_permissions_member?id=${item.id}&type=${item.type}`, { user_id: userId });
    }

    addPermissionsMember(item: Protected, userId: GroupId) {
        return this.http.post<void>(`add_permissions_member?id=${item.id}&type=${item.type}`, { user_id: userId });
    }

    searchByContains(pattern: string) {
        return this.http.get<Array<Group>>(`search_by_contains?pattern=${pattern}`);
    }
}
