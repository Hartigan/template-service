import { GlobalSettings } from '../settings/GlobalSettings'
import { HttpService } from './HttpService';
import { HeadId, CommitId, UserId } from '../models/Identificators';
import { Head } from '../models/Head';
import { Commit } from '../models/Commit';
import { HttpServiceFactory } from './HttpServiceFactory';

export class VersionService {
    private http : HttpService;

    constructor(httpServiceFactory: HttpServiceFactory) {
        this.http = httpServiceFactory.create(`${GlobalSettings.ApiBaseUrl}/version`);
    }

    getHead(id: HeadId) {
        return this.http.get<Head>(`head?id=${id}`);
    }

    getCommit(id: CommitId) {
        return this.http.get<Commit>(`commit?id=${id}`);
    }

    updateTags(head: HeadId, tags: Array<string>) {
        return this.http.post<any>(`update_tags`, { head_id: head, tags: tags });
    }

    search(ownerId: UserId | null, tags: Array<string>, pattern: string | null, offset: number, limit: number) {
        return this.http.post<Array<Head>>(`search`, { 
            owner_id: ownerId,
            tags: tags,
            pattern: pattern ? pattern : null,
            offset: offset,
            limit: limit
        });
    }
}