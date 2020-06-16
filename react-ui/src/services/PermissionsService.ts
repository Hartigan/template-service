import { GlobalSettings } from '../settings/GlobalSettings'
import { HttpService } from './HttpService';
import { HttpServiceFactory } from './HttpServiceFactory';
import { GroupId, FolderId, HeadId, SubmissionId, ReportId, UserId } from '../models/Identificators';
import { Permissions, Access } from '../models/Permissions';

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

    getPermissions(item: Protected) {
        return this.http.get<Permissions>(`permissions?id=${item.id}&type=${item.type}`);
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
}
