import { GlobalSettings } from '../settings/GlobalSettings'
import { HttpService } from './HttpService';
import { CommitId, HeadId, FolderId, Id } from '../models/Identificators';
import { Problem } from '../models/Problem';
import { HttpServiceFactory } from './HttpServiceFactory';
import { GeneratedProblem } from '../models/GeneratedProblem';

export class ProblemsService {
    private http : HttpService;

    constructor(httpServiceFactory: HttpServiceFactory) {
        this.http = httpServiceFactory.create(`${GlobalSettings.ApiBaseUrl}/problems`);
    }

    get(id: CommitId) {
        return this.http.get<Problem>(`model?id=${id}`);
    }

    test(id: CommitId, seed: number) {
        return this.http.get<GeneratedProblem>(`test?id=${id}&seed=${seed}`);
    }

    validate(id: CommitId, expected: string, actual: string) {
        return this.http.get<boolean>(`validate?id=${id}&expected=${encodeURIComponent(expected)}&actual=${encodeURIComponent(actual)}`);
    }

    create(folder: FolderId, headName: string, problem: Problem) {
        return this.http.post<Id<HeadId>>(`create`, { folder_id: folder, name: headName, problem: problem });
    }

    update(head: HeadId, description: string, problem: Problem) {
        return this.http.post<Id<CommitId>>(`update`, { head_id: head, description: description, problem: problem });
    }
}
