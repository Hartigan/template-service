import { GlobalSettings } from '../settings/GlobalSettings'
import { HttpService } from './HttpService';
import { HttpServiceFactory } from './HttpServiceFactory';
import { Group, Access } from '../models/Permissions';
import { Id, GroupId, UserId } from '../models/Identificators';


export class GroupService {
    private http : HttpService;

    constructor(httpServiceFactory: HttpServiceFactory) {
        this.http = httpServiceFactory.create(`${GlobalSettings.ApiBaseUrl}/group`);
    }

    create(name: string, description: string) {
        return this.http.post<Id<GroupId>>(`create`, { name: name, description: description });
    }

    get(id: GroupId) {
        return this.http.get<Group>(`get?id=${id}`);
    }

    getGroups(access: Access) {
        return this.http.get<Array<Group>>(`list?admin=${access.admin}&read=${access.read}&write=${access.write}&generate=${access.generate}`);
    }

    update(id: GroupId, userId: UserId, name?: string, description?: string) {
        return this.http.post<void>(`update`, { id: id, user_id: userId, name: name, description: description });
    }

    updateMember(id: GroupId, userId: UserId, access: Access) {
        return this.http.post<void>(`update_member`, { id: id, user_id: userId, access: access });
    }

    removeMember(id: GroupId, userId: UserId) {
        return this.http.post<void>(`remove_member`, { id: id, user_id: userId });
    }

    addMember(id: GroupId, userId: UserId) {
        return this.http.post<void>(`add_member`, { id: id, user_id: userId });
    }

    search(pattern: string | null, offset: number, limit: number) {
        return this.http.post<Array<Group>>(`search`, { pattern: pattern ? pattern : null, offset: offset, limit: limit });
    }
}
