import { GlobalSettings } from '../settings/GlobalSettings'
import { HttpService } from './HttpService';
import { HeadId, CommitId } from '../models/Identificators';
import { Head } from '../models/Head';
import { Commit } from '../models/Commit';

export class FoldersService {
    private http = new HttpService(`${GlobalSettings.ApiBaseUrl}/version`);

    constructor() {
    }

    getHead(id: HeadId) {
        return this.http.get<Head>(`head?id=${id}`);
    }

    getCommit(id: CommitId) {
        return this.http.get<Commit>(`commit?id=${id}`);
    }
}