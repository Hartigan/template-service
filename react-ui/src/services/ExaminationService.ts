import { GlobalSettings } from '../settings/GlobalSettings'
import { ExaminationServiceClient } from '../protobuf/ExaminationServiceClientPb';
import { AuthService } from './AuthService';
import { ApplyAnswerReply, ApplyAnswerRequest, CompleteSubmissionReply, CompleteSubmissionRequest, GetProblemSetPreviewReply, GetProblemSetPreviewRequest, GetProblemSetsReply, GetProblemSetsRequest, GetReportReply, GetReportRequest, GetReportsReply, GetReportsRequest, GetSubmissionPreviewReply, GetSubmissionReply, GetSubmissionRequest, GetSubmissionsReply, GetSubmissionsRequest, ShareReportReply, ShareReportRequest, StartSubmissionReply, StartSubmissionRequest } from '../protobuf/examination_pb';
import { BaseService } from './BaseService';

export class ExaminationService extends BaseService<ExaminationServiceClient> {

    constructor(authService: AuthService) {
        super(authService, new ExaminationServiceClient(GlobalSettings.ApiBaseUrl));
    }

    getSubmission(request: GetSubmissionRequest) {
        return this.doCall<GetSubmissionRequest, GetSubmissionReply>(this.client.getSubmission)(request);
    }

    applyAnswer(request: ApplyAnswerRequest) {
        return this.doCall<ApplyAnswerRequest, ApplyAnswerReply>(this.client.applyAnswer)(request);
    }

    completeSubmission(request: CompleteSubmissionRequest) {
        return this.doCall<CompleteSubmissionRequest, CompleteSubmissionReply>(this.client.completeSubmission)(request);
    }

    startSubmission(request: StartSubmissionRequest) {
        return this.doCall<StartSubmissionRequest, StartSubmissionReply>(this.client.startSubmission)(request);
    }

    getReport(request: GetReportRequest) {
        return this.doCall<GetReportRequest, GetReportReply>(this.client.getReport)(request);
    }

    getSubmissions(request: GetSubmissionsRequest) {
        return this.doCall<GetSubmissionsRequest, GetSubmissionsReply>(this.client.getSubmissions)(request);
    }

    getReports(request: GetReportsRequest) {
        return this.doCall<GetReportsRequest, GetReportsReply>(this.client.getReports)(request);
    }

    shareReport(request: ShareReportRequest) {
        return this.doCall<ShareReportRequest, ShareReportReply>(this.client.shareReport)(request);
    }

    getProblemSets(request: GetProblemSetsRequest) {
        return this.doCall<GetProblemSetsRequest, GetProblemSetsReply>(this.client.getProblemSets)(request);
    }

    getProblemSetPreview(request: GetProblemSetPreviewRequest) {
        return this.doCall<GetProblemSetPreviewRequest, GetProblemSetPreviewReply>(this.client.getProblemSetPreview)(request);
    }

    getSubmissionPreview(request: GetSubmissionRequest) {
        return this.doCall<GetSubmissionRequest, GetSubmissionPreviewReply>(this.client.getSubmissionPreview)(request);
    }
}