import { GlobalSettings } from '../settings/GlobalSettings'
import { ExaminationServiceClient } from '../protobuf/ExaminationServiceClientPb';
import { AuthService } from './AuthService';
import { ApplyAnswerReply, ApplyAnswerRequest, CompleteSubmissionReply, CompleteSubmissionRequest, GetProblemSetsPreviewsReply, GetProblemSetsPreviewsRequest, GetProblemSetsReply, GetProblemSetsRequest, GetReportReply, GetReportRequest, GetReportsReply, GetReportsRequest, GetSubmissionReply, GetSubmissionRequest, GetSubmissionsPreviewsReply, GetSubmissionsPreviewsRequest, GetSubmissionsReply, GetSubmissionsRequest, ShareReportReply, ShareReportRequest, StartSubmissionReply, StartSubmissionRequest } from '../protobuf/examination_pb';
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

    getProblemSetsPreviews(request: GetProblemSetsPreviewsRequest) {
        return this.doCall<GetProblemSetsPreviewsRequest, GetProblemSetsPreviewsReply>(this.client.getProblemSetsPreviews)(request);
    }

    getSubmissionsPreviews(request: GetSubmissionsPreviewsRequest) {
        return this.doCall<GetSubmissionsPreviewsRequest, GetSubmissionsPreviewsReply>(this.client.getSubmissionsPreviews)(request);
    }
}