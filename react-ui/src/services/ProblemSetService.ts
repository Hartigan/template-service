import { GlobalSettings } from '../settings/GlobalSettings'
import { HttpService } from './HttpService';
import { CommitId, HeadId, FolderId, Id } from '../models/Identificators';
import { ProblemSet } from '../models/ProblemSet';

export class ProblemSetService {
    private http = new HttpService(`${GlobalSettings.ApiBaseUrl}/problem_set`);

    constructor() {
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
