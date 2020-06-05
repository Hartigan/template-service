import { GlobalSettings } from '../settings/GlobalSettings'
import { HttpService } from './HttpService';
import { HttpServiceFactory } from './HttpServiceFactory';
import { UserId } from '../models/Identificators';
import { User } from '../models/User';

export class UserService {
    private http : HttpService;

    constructor(httpServiceFactory: HttpServiceFactory) {
        this.http = httpServiceFactory.create(`${GlobalSettings.ApiBaseUrl}/user`);
    }

    get(id: UserId) {
        return this.http.get<User>(`get?id=${id}`);
    }

    search(pattern: string | null, offset: number, limit: number) {
        return this.http.post<Array<User>>(`search`, { pattern: pattern, offset: offset, limit: limit });
    }
}