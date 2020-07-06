import { GlobalSettings } from '../settings/GlobalSettings'
import { HttpService } from './HttpService';
import { HttpServiceFactory } from './HttpServiceFactory';
import { UserId } from '../models/Identificators';
import { AdminUser } from '../models/AdminUser';

export class AdminService {
    private http : HttpService;

    constructor(httpServiceFactory: HttpServiceFactory) {
        this.http = httpServiceFactory.create(`${GlobalSettings.ApiBaseUrl}/admin`);
    }

    get() {
        return this.http.get<Array<AdminUser>>(`get`);
    }

    update(userId: UserId, roles: Array<string>) {
        return this.http.post<any>(`update`, { user_id: userId, roles: roles });
    }
}