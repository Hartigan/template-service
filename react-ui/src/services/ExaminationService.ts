import { GlobalSettings } from '../settings/GlobalSettings'
import { HttpService } from './HttpService';
import { Submission, ProblemAnswer } from '../models/Submission';
import { SubmissionId, ReportId, Id, HeadId, CommitId, UserId, GroupId } from '../models/Identificators';
import { Report } from '../models/Report';
import { HttpServiceFactory } from './HttpServiceFactory';
import { ProblemSetPreview } from '../models/ProblemSetPreview';
import { Head } from '../models/Head';
import { SubmissionPreview } from '../models/SubmissionPreview';

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

    getReports() {
        return this.http.get<Array<ReportId>>(`reports`);
    }

    getSearchReportsByAuthor(userId: UserId) {
        return this.http.get<Array<ReportId>>(`reports_by_author?author_id=${userId}`);
    }

    shareReport(reportId: ReportId, users: Array<UserId>, groups: Array<GroupId>) {
        return this.http.post<void>(`share_report`, {
            id: reportId,
            user_ids: users,
            group_ids: groups
        });
    }

    getProblemSets(tags?: Array<string>) {
        if (tags && tags.length > 0) {
            const encodedTags = tags.map(x => encodeURIComponent(x)).join(",");
            return this.http.get<Array<Head>>(`problem_sets_by_tags?tags=${encodedTags}`);
        }
        return this.http.get<Array<Head>>(`problem_sets`);
    }

    getProblemSetPreview(id: CommitId) {
        return this.http.get<ProblemSetPreview>(`problem_set_preview?id=${id}`);
    }

    getSubmissionPreview(id: SubmissionId) {
        return this.http.get<SubmissionPreview>(`submission_preview?id=${id}`);
    }
}