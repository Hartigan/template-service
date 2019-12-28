import { GlobalSettings } from '../settings/GlobalSettings'
import { HttpService } from './HttpService';
import { Submission, ProblemAnswer } from '../models/Submission';
import { SubmissionId, ReportId, Id, HeadId } from '../models/Identificators';
import { Report } from '../models/Report';
import { HttpServiceFactory } from './HttpServiceFactory';

export class ExaminationService {
    private http : HttpService;

    constructor(httpServiceFactory: HttpServiceFactory) {
        this.http = httpServiceFactory.create(`${GlobalSettings.ApiBaseUrl}/examination`);
    }

    getSubmission(id: SubmissionId) {
        return this.http.get<Submission>(`submission?id=${id}`);
    }

    applyAnswer(submissionId: SubmissionId, problemAnswer: ProblemAnswer) {
        return this.http.post<void>(`answer`, { id: submissionId, problem_answer: problemAnswer });
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
        return this.http.get<Array<Submission>>(`submissions`);
    }

    getReports() {
        return this.http.get<Array<Report>>(`reports`);
    }
}