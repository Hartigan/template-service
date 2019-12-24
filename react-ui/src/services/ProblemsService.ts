import { GlobalSettings } from '../settings/GlobalSettings'
import { HttpService } from './HttpService';
import { CommitId, HeadId, FolderId, Id } from '../models/Identificators';
import { Problem } from '../models/Problem';

export class ProblemsService {
    private http = new HttpService(`${GlobalSettings.ApiBaseUrl}/problems`);

    constructor() {
    }

    get(id: CommitId) {
        return this.http.get<Problem>(`model?id=${id}`);
    }

    create(folder: FolderId, headName: string, problem: Problem) {
        return this.http.post<Id<HeadId>>(`create`, { folder_id: folder, name: headName, problem: problem });
    }

    update(head: HeadId, description: string, problem: Problem) {
        return this.http.post<Id<CommitId>>(`update`, { head_id: head, description: description, problem: problem });
    }
}
