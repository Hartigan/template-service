import { GlobalSettings } from '../settings/GlobalSettings'
import { HttpService } from './HttpService';
import { Submission, ProblemAnswer } from '../models/Submission';
import { SubmissionId, ReportId, Id, HeadId, CommitId, UserId, GroupId } from '../models/Identificators';
import { Report } from '../models/Report';
import { HttpServiceFactory } from './HttpServiceFactory';
import { ProblemSetPreview } from '../models/ProblemSetPreview';
import { Head } from '../models/Head';
import { SubmissionPreview } from '../models/SubmissionPreview';
import { SearchInterval } from '../models/SearchInterval';

export class ExaminationService {
    private http : HttpService;

    constructor(httpServiceFactory: HttpServiceFactory) {
        this.http = httpServiceFactory.create(`${GlobalSettings.ApiBaseUrl}/examination`);
    }

    getSubmission(id: SubmissionId) {
        return this.http.get<Submission>(`submission?id=${id}`);
    }

    applyAnswer(submissionId: SubmissionId, problemAnswer: ProblemAnswer) {
        return this.http.post<void>(`answer`, { id: submissionId, answer: problemAnswer.answer, generated_problem_id: problemAnswer.generated_problem_id });
    }

    complete(id: SubmissionId) {
        return this.http.get<Id<ReportId>>(`complete?id=${id}`);
    }

    start(id: HeadId) {
        return this.http.get<Id<SubmissionId>>(`start?id=${id}`);
    }

    getReport(id: ReportId) {
        return this.http.get<Report>(`report?id=${id}`);
    }

    getSubmissions() {
        return this.http.get<Array<SubmissionId>>(`submissions`);
    }

    getReports(pattern: string | null, userId: UserId | null, offset: number, limit: number) {
        return this.http.post<Array<ReportId>>(`reports`, {
            pattern: pattern ? pattern : null,
            user_id: userId,
            offset: offset,
            limit: limit
        });
    }

    shareReport(reportId: ReportId, users: Array<UserId>, groups: Array<GroupId>) {
        return this.http.post<void>(`share_report`, {
            id: reportId,
            user_ids: users,
            group_ids: groups
        });
    }

    getProblemSets(
        isPublic: boolean,
        pattern: string | null,
        tags: Array<string> | null,
        authorId: UserId | null,
        problemsCount: SearchInterval<number> | null,
        duration: SearchInterval<number> | null,
        offset: number,
        limit: number) {
        return this.http.post<Array<Head>>(
            `problem_sets`,
            {
                is_public: isPublic,
                pattern: pattern ? pattern : null,
                tags: tags ? tags : null,
                author_id: authorId,
                problems_count: problemsCount,
                duration: duration,
                offset: offset,
                limit: limit
            }
        );
    }

    getProblemSetPreview(id: CommitId) {
        return this.http.get<ProblemSetPreview>(`problem_set_preview?id=${id}`);
    }

    getSubmissionPreview(id: SubmissionId) {
        return this.http.get<SubmissionPreview>(`submission_preview?id=${id}`);
    }
}