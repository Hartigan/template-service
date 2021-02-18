/**
 * @fileoverview gRPC-Web generated client stub for examination
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as examination_pb from './examination_pb';


export class ExaminationServiceClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoGetSubmission = new grpcWeb.AbstractClientBase.MethodInfo(
    examination_pb.GetSubmissionReply,
    (request: examination_pb.GetSubmissionRequest) => {
      return request.serializeBinary();
    },
    examination_pb.GetSubmissionReply.deserializeBinary
  );

  getSubmission(
    request: examination_pb.GetSubmissionRequest,
    metadata: grpcWeb.Metadata | null): Promise<examination_pb.GetSubmissionReply>;

  getSubmission(
    request: examination_pb.GetSubmissionRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: examination_pb.GetSubmissionReply) => void): grpcWeb.ClientReadableStream<examination_pb.GetSubmissionReply>;

  getSubmission(
    request: examination_pb.GetSubmissionRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: examination_pb.GetSubmissionReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/examination.ExaminationService/GetSubmission',
        request,
        metadata || {},
        this.methodInfoGetSubmission,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/examination.ExaminationService/GetSubmission',
    request,
    metadata || {},
    this.methodInfoGetSubmission);
  }

  methodInfoApplyAnswer = new grpcWeb.AbstractClientBase.MethodInfo(
    examination_pb.ApplyAnswerReply,
    (request: examination_pb.ApplyAnswerRequest) => {
      return request.serializeBinary();
    },
    examination_pb.ApplyAnswerReply.deserializeBinary
  );

  applyAnswer(
    request: examination_pb.ApplyAnswerRequest,
    metadata: grpcWeb.Metadata | null): Promise<examination_pb.ApplyAnswerReply>;

  applyAnswer(
    request: examination_pb.ApplyAnswerRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: examination_pb.ApplyAnswerReply) => void): grpcWeb.ClientReadableStream<examination_pb.ApplyAnswerReply>;

  applyAnswer(
    request: examination_pb.ApplyAnswerRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: examination_pb.ApplyAnswerReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/examination.ExaminationService/ApplyAnswer',
        request,
        metadata || {},
        this.methodInfoApplyAnswer,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/examination.ExaminationService/ApplyAnswer',
    request,
    metadata || {},
    this.methodInfoApplyAnswer);
  }

  methodInfoCompleteSubmission = new grpcWeb.AbstractClientBase.MethodInfo(
    examination_pb.CompleteSubmissionReply,
    (request: examination_pb.CompleteSubmissionRequest) => {
      return request.serializeBinary();
    },
    examination_pb.CompleteSubmissionReply.deserializeBinary
  );

  completeSubmission(
    request: examination_pb.CompleteSubmissionRequest,
    metadata: grpcWeb.Metadata | null): Promise<examination_pb.CompleteSubmissionReply>;

  completeSubmission(
    request: examination_pb.CompleteSubmissionRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: examination_pb.CompleteSubmissionReply) => void): grpcWeb.ClientReadableStream<examination_pb.CompleteSubmissionReply>;

  completeSubmission(
    request: examination_pb.CompleteSubmissionRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: examination_pb.CompleteSubmissionReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/examination.ExaminationService/CompleteSubmission',
        request,
        metadata || {},
        this.methodInfoCompleteSubmission,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/examination.ExaminationService/CompleteSubmission',
    request,
    metadata || {},
    this.methodInfoCompleteSubmission);
  }

  methodInfoStartSubmission = new grpcWeb.AbstractClientBase.MethodInfo(
    examination_pb.StartSubmissionReply,
    (request: examination_pb.StartSubmissionRequest) => {
      return request.serializeBinary();
    },
    examination_pb.StartSubmissionReply.deserializeBinary
  );

  startSubmission(
    request: examination_pb.StartSubmissionRequest,
    metadata: grpcWeb.Metadata | null): Promise<examination_pb.StartSubmissionReply>;

  startSubmission(
    request: examination_pb.StartSubmissionRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: examination_pb.StartSubmissionReply) => void): grpcWeb.ClientReadableStream<examination_pb.StartSubmissionReply>;

  startSubmission(
    request: examination_pb.StartSubmissionRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: examination_pb.StartSubmissionReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/examination.ExaminationService/StartSubmission',
        request,
        metadata || {},
        this.methodInfoStartSubmission,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/examination.ExaminationService/StartSubmission',
    request,
    metadata || {},
    this.methodInfoStartSubmission);
  }

  methodInfoGetReport = new grpcWeb.AbstractClientBase.MethodInfo(
    examination_pb.GetReportReply,
    (request: examination_pb.GetReportRequest) => {
      return request.serializeBinary();
    },
    examination_pb.GetReportReply.deserializeBinary
  );

  getReport(
    request: examination_pb.GetReportRequest,
    metadata: grpcWeb.Metadata | null): Promise<examination_pb.GetReportReply>;

  getReport(
    request: examination_pb.GetReportRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: examination_pb.GetReportReply) => void): grpcWeb.ClientReadableStream<examination_pb.GetReportReply>;

  getReport(
    request: examination_pb.GetReportRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: examination_pb.GetReportReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/examination.ExaminationService/GetReport',
        request,
        metadata || {},
        this.methodInfoGetReport,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/examination.ExaminationService/GetReport',
    request,
    metadata || {},
    this.methodInfoGetReport);
  }

  methodInfoGetSubmissions = new grpcWeb.AbstractClientBase.MethodInfo(
    examination_pb.GetSubmissionsReply,
    (request: examination_pb.GetSubmissionsRequest) => {
      return request.serializeBinary();
    },
    examination_pb.GetSubmissionsReply.deserializeBinary
  );

  getSubmissions(
    request: examination_pb.GetSubmissionsRequest,
    metadata: grpcWeb.Metadata | null): Promise<examination_pb.GetSubmissionsReply>;

  getSubmissions(
    request: examination_pb.GetSubmissionsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: examination_pb.GetSubmissionsReply) => void): grpcWeb.ClientReadableStream<examination_pb.GetSubmissionsReply>;

  getSubmissions(
    request: examination_pb.GetSubmissionsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: examination_pb.GetSubmissionsReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/examination.ExaminationService/GetSubmissions',
        request,
        metadata || {},
        this.methodInfoGetSubmissions,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/examination.ExaminationService/GetSubmissions',
    request,
    metadata || {},
    this.methodInfoGetSubmissions);
  }

  methodInfoGetReports = new grpcWeb.AbstractClientBase.MethodInfo(
    examination_pb.GetReportsReply,
    (request: examination_pb.GetReportsRequest) => {
      return request.serializeBinary();
    },
    examination_pb.GetReportsReply.deserializeBinary
  );

  getReports(
    request: examination_pb.GetReportsRequest,
    metadata: grpcWeb.Metadata | null): Promise<examination_pb.GetReportsReply>;

  getReports(
    request: examination_pb.GetReportsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: examination_pb.GetReportsReply) => void): grpcWeb.ClientReadableStream<examination_pb.GetReportsReply>;

  getReports(
    request: examination_pb.GetReportsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: examination_pb.GetReportsReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/examination.ExaminationService/GetReports',
        request,
        metadata || {},
        this.methodInfoGetReports,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/examination.ExaminationService/GetReports',
    request,
    metadata || {},
    this.methodInfoGetReports);
  }

  methodInfoShareReport = new grpcWeb.AbstractClientBase.MethodInfo(
    examination_pb.ShareReportReply,
    (request: examination_pb.ShareReportRequest) => {
      return request.serializeBinary();
    },
    examination_pb.ShareReportReply.deserializeBinary
  );

  shareReport(
    request: examination_pb.ShareReportRequest,
    metadata: grpcWeb.Metadata | null): Promise<examination_pb.ShareReportReply>;

  shareReport(
    request: examination_pb.ShareReportRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: examination_pb.ShareReportReply) => void): grpcWeb.ClientReadableStream<examination_pb.ShareReportReply>;

  shareReport(
    request: examination_pb.ShareReportRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: examination_pb.ShareReportReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/examination.ExaminationService/ShareReport',
        request,
        metadata || {},
        this.methodInfoShareReport,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/examination.ExaminationService/ShareReport',
    request,
    metadata || {},
    this.methodInfoShareReport);
  }

  methodInfoGetProblemSets = new grpcWeb.AbstractClientBase.MethodInfo(
    examination_pb.GetProblemSetsReply,
    (request: examination_pb.GetProblemSetsRequest) => {
      return request.serializeBinary();
    },
    examination_pb.GetProblemSetsReply.deserializeBinary
  );

  getProblemSets(
    request: examination_pb.GetProblemSetsRequest,
    metadata: grpcWeb.Metadata | null): Promise<examination_pb.GetProblemSetsReply>;

  getProblemSets(
    request: examination_pb.GetProblemSetsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: examination_pb.GetProblemSetsReply) => void): grpcWeb.ClientReadableStream<examination_pb.GetProblemSetsReply>;

  getProblemSets(
    request: examination_pb.GetProblemSetsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: examination_pb.GetProblemSetsReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/examination.ExaminationService/GetProblemSets',
        request,
        metadata || {},
        this.methodInfoGetProblemSets,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/examination.ExaminationService/GetProblemSets',
    request,
    metadata || {},
    this.methodInfoGetProblemSets);
  }

  methodInfoGetProblemSetsPreviews = new grpcWeb.AbstractClientBase.MethodInfo(
    examination_pb.GetProblemSetsPreviewsReply,
    (request: examination_pb.GetProblemSetsPreviewsRequest) => {
      return request.serializeBinary();
    },
    examination_pb.GetProblemSetsPreviewsReply.deserializeBinary
  );

  getProblemSetsPreviews(
    request: examination_pb.GetProblemSetsPreviewsRequest,
    metadata: grpcWeb.Metadata | null): Promise<examination_pb.GetProblemSetsPreviewsReply>;

  getProblemSetsPreviews(
    request: examination_pb.GetProblemSetsPreviewsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: examination_pb.GetProblemSetsPreviewsReply) => void): grpcWeb.ClientReadableStream<examination_pb.GetProblemSetsPreviewsReply>;

  getProblemSetsPreviews(
    request: examination_pb.GetProblemSetsPreviewsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: examination_pb.GetProblemSetsPreviewsReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/examination.ExaminationService/GetProblemSetsPreviews',
        request,
        metadata || {},
        this.methodInfoGetProblemSetsPreviews,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/examination.ExaminationService/GetProblemSetsPreviews',
    request,
    metadata || {},
    this.methodInfoGetProblemSetsPreviews);
  }

  methodInfoGetSubmissionsPreviews = new grpcWeb.AbstractClientBase.MethodInfo(
    examination_pb.GetSubmissionsPreviewsReply,
    (request: examination_pb.GetSubmissionsPreviewsRequest) => {
      return request.serializeBinary();
    },
    examination_pb.GetSubmissionsPreviewsReply.deserializeBinary
  );

  getSubmissionsPreviews(
    request: examination_pb.GetSubmissionsPreviewsRequest,
    metadata: grpcWeb.Metadata | null): Promise<examination_pb.GetSubmissionsPreviewsReply>;

  getSubmissionsPreviews(
    request: examination_pb.GetSubmissionsPreviewsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: examination_pb.GetSubmissionsPreviewsReply) => void): grpcWeb.ClientReadableStream<examination_pb.GetSubmissionsPreviewsReply>;

  getSubmissionsPreviews(
    request: examination_pb.GetSubmissionsPreviewsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: examination_pb.GetSubmissionsPreviewsReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/examination.ExaminationService/GetSubmissionsPreviews',
        request,
        metadata || {},
        this.methodInfoGetSubmissionsPreviews,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/examination.ExaminationService/GetSubmissionsPreviews',
    request,
    metadata || {},
    this.methodInfoGetSubmissionsPreviews);
  }

}

