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

    searchByContains(pattern: string) {
        return this.http.get<Array<User>>(`search_by_contains?pattern=${pattern}`);
    }
}