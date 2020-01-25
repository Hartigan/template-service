import { GlobalSettings } from '../settings/GlobalSettings'
import { HttpService } from './HttpService';
import { HttpServiceFactory } from './HttpServiceFactory';
import { Id, GroupId, FolderId, CommitId, HeadId, SubmissionId, ReportId, UserId } from '../models/Identificators';
import { Group, Permissions, Access } from '../models/Permissions';

type ProtectedType = "folder" | "head" | "commit" | "submission" | "report";
type ProtectedId = FolderId | HeadId | CommitId | SubmissionId | ReportId;

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

    getPermissions(id: ProtectedId, type: ProtectedType) {
        return this.http.get<Permissions>(`permissions?id=${id}&type=${type}`);
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

    updatePermissionsGroup(id: ProtectedId, type: ProtectedType, groupId: GroupId, access: Access) {
        return this.http.post<void>(`update_permissions_group?id=${id}&type=${type}`, { group_id: groupId, access: access });
    }

    removePermissionsGroup(id: ProtectedId, type: ProtectedType, groupId: GroupId) {
        return this.http.post<void>(`remove_permissions_group?id=${id}&type=${type}`, { group_id: groupId });
    }

    updatePermissionsMember(id: ProtectedId, type: ProtectedType, userId: UserId, access: Access) {
        return this.http.post<void>(`update_permissions_member?id=${id}&type=${type}`, { user_id: userId, access: access });
    }

    removePermissionsMember(id: ProtectedId, type: ProtectedType, userId: GroupId) {
        return this.http.post<void>(`remove_permissions_group?id=${id}&type=${type}`, { user_id: userId });
    }
}
