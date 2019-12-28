import { GlobalSettings } from '../settings/GlobalSettings'
import { HttpService } from './HttpService';
import { CommitId, HeadId, FolderId, Id } from '../models/Identificators';
import { ProblemSet } from '../models/ProblemSet';
import { HttpServiceFactory } from './HttpServiceFactory';

export class ProblemSetService {
    private http : HttpService;

    constructor(httpServiceFactory: HttpServiceFactory) {
        this.http = httpServiceFactory.create(`${GlobalSettings.ApiBaseUrl}/problem_set`);
    }

    get(id: CommitId) {
        return this.http.get<ProblemSet>(`model?id=${id}`);
    }

    create(folder: FolderId, headName: string, problemSet: ProblemSet) {
        return this.http.post<Id<HeadId>>(`create`, { folder_id: folder, name: headName, problem_set: problemSet });
    }

    update(head: HeadId, description: string, problemSet: ProblemSet) {
        return this.http.post<Id<CommitId>>(`update`, { head_id: head, description: description, problem_set: problemSet });
    }
}
