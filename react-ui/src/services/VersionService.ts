import { GlobalSettings } from '../settings/GlobalSettings'
import { HttpService } from './HttpService';
import { HeadId, CommitId } from '../models/Identificators';
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
}