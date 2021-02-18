import * as jspb from 'google-protobuf'

import * as domain_pb from './domain_pb';
import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';


export class GetSubmissionsPreviewsRequest extends jspb.Message {
  getSubmissionIdsList(): Array<string>;
  setSubmissionIdsList(value: Array<string>): GetSubmissionsPreviewsRequest;
  clearSubmissionIdsList(): GetSubmissionsPreviewsRequest;
  addSubmissionIds(value: string, index?: number): GetSubmissionsPreviewsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSubmissionsPreviewsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetSubmissionsPreviewsRequest): GetSubmissionsPreviewsRequest.AsObject;
  static serializeBinaryToWriter(message: GetSubmissionsPreviewsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSubmissionsPreviewsRequest;
  static deserializeBinaryFromReader(message: GetSubmissionsPreviewsRequest, reader: jspb.BinaryReader): GetSubmissionsPreviewsRequest;
}

export namespace GetSubmissionsPreviewsRequest {
  export type AsObject = {
    submissionIdsList: Array<string>,
  }
}

export class GetSubmissionsPreviewsReply extends jspb.Message {
  getPreviewsList(): Array<GetSubmissionsPreviewsReply.Entry>;
  setPreviewsList(value: Array<GetSubmissionsPreviewsReply.Entry>): GetSubmissionsPreviewsReply;
  clearPreviewsList(): GetSubmissionsPreviewsReply;
  addPreviews(value?: GetSubmissionsPreviewsReply.Entry, index?: number): GetSubmissionsPreviewsReply.Entry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSubmissionsPreviewsReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetSubmissionsPreviewsReply): GetSubmissionsPreviewsReply.AsObject;
  static serializeBinaryToWriter(message: GetSubmissionsPreviewsReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSubmissionsPreviewsReply;
  static deserializeBinaryFromReader(message: GetSubmissionsPreviewsReply, reader: jspb.BinaryReader): GetSubmissionsPreviewsReply;
}

export namespace GetSubmissionsPreviewsReply {
  export type AsObject = {
    previewsList: Array<GetSubmissionsPreviewsReply.Entry.AsObject>,
  }

  export class Entry extends jspb.Message {
    getStatus(): GetSubmissionsPreviewsReply.Status;
    setStatus(value: GetSubmissionsPreviewsReply.Status): Entry;

    getPreview(): domain_pb.SubmissionPreview | undefined;
    setPreview(value?: domain_pb.SubmissionPreview): Entry;
    hasPreview(): boolean;
    clearPreview(): Entry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Entry.AsObject;
    static toObject(includeInstance: boolean, msg: Entry): Entry.AsObject;
    static serializeBinaryToWriter(message: Entry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Entry;
    static deserializeBinaryFromReader(message: Entry, reader: jspb.BinaryReader): Entry;
  }

  export namespace Entry {
    export type AsObject = {
      status: GetSubmissionsPreviewsReply.Status,
      preview?: domain_pb.SubmissionPreview.AsObject,
    }
  }


  export enum Status { 
    OK = 0,
    UNKNOWN = 1,
    NO_ACCESS = 2,
  }
}

export class GetProblemSetsPreviewsRequest extends jspb.Message {
  getCommitIdsList(): Array<string>;
  setCommitIdsList(value: Array<string>): GetProblemSetsPreviewsRequest;
  clearCommitIdsList(): GetProblemSetsPreviewsRequest;
  addCommitIds(value: string, index?: number): GetProblemSetsPreviewsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProblemSetsPreviewsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetProblemSetsPreviewsRequest): GetProblemSetsPreviewsRequest.AsObject;
  static serializeBinaryToWriter(message: GetProblemSetsPreviewsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetProblemSetsPreviewsRequest;
  static deserializeBinaryFromReader(message: GetProblemSetsPreviewsRequest, reader: jspb.BinaryReader): GetProblemSetsPreviewsRequest;
}

export namespace GetProblemSetsPreviewsRequest {
  export type AsObject = {
    commitIdsList: Array<string>,
  }
}

export class GetProblemSetsPreviewsReply extends jspb.Message {
  getPreviewsList(): Array<GetProblemSetsPreviewsReply.Entry>;
  setPreviewsList(value: Array<GetProblemSetsPreviewsReply.Entry>): GetProblemSetsPreviewsReply;
  clearPreviewsList(): GetProblemSetsPreviewsReply;
  addPreviews(value?: GetProblemSetsPreviewsReply.Entry, index?: number): GetProblemSetsPreviewsReply.Entry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProblemSetsPreviewsReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetProblemSetsPreviewsReply): GetProblemSetsPreviewsReply.AsObject;
  static serializeBinaryToWriter(message: GetProblemSetsPreviewsReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetProblemSetsPreviewsReply;
  static deserializeBinaryFromReader(message: GetProblemSetsPreviewsReply, reader: jspb.BinaryReader): GetProblemSetsPreviewsReply;
}

export namespace GetProblemSetsPreviewsReply {
  export type AsObject = {
    previewsList: Array<GetProblemSetsPreviewsReply.Entry.AsObject>,
  }

  export class Entry extends jspb.Message {
    getStatus(): GetProblemSetsPreviewsReply.Status;
    setStatus(value: GetProblemSetsPreviewsReply.Status): Entry;

    getCommitId(): string;
    setCommitId(value: string): Entry;

    getPreview(): domain_pb.ProblemSetPreview | undefined;
    setPreview(value?: domain_pb.ProblemSetPreview): Entry;
    hasPreview(): boolean;
    clearPreview(): Entry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Entry.AsObject;
    static toObject(includeInstance: boolean, msg: Entry): Entry.AsObject;
    static serializeBinaryToWriter(message: Entry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Entry;
    static deserializeBinaryFromReader(message: Entry, reader: jspb.BinaryReader): Entry;
  }

  export namespace Entry {
    export type AsObject = {
      status: GetProblemSetsPreviewsReply.Status,
      commitId: string,
      preview?: domain_pb.ProblemSetPreview.AsObject,
    }
  }


  export enum Status { 
    OK = 0,
    UNKNOWN = 1,
    NO_ACCESS = 2,
    NOT_FOUND = 3,
  }
}

export class GetProblemSetsRequest extends jspb.Message {
  getIsPublic(): boolean;
  setIsPublic(value: boolean): GetProblemSetsRequest;

  getPattern(): google_protobuf_wrappers_pb.StringValue | undefined;
  setPattern(value?: google_protobuf_wrappers_pb.StringValue): GetProblemSetsRequest;
  hasPattern(): boolean;
  clearPattern(): GetProblemSetsRequest;

  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): GetProblemSetsRequest;
  clearTagsList(): GetProblemSetsRequest;
  addTags(value: string, index?: number): GetProblemSetsRequest;

  getAuthorId(): google_protobuf_wrappers_pb.StringValue | undefined;
  setAuthorId(value?: google_protobuf_wrappers_pb.StringValue): GetProblemSetsRequest;
  hasAuthorId(): boolean;
  clearAuthorId(): GetProblemSetsRequest;

  getProblemsCount(): domain_pb.UInt32Interval | undefined;
  setProblemsCount(value?: domain_pb.UInt32Interval): GetProblemSetsRequest;
  hasProblemsCount(): boolean;
  clearProblemsCount(): GetProblemSetsRequest;

  getDurationS(): domain_pb.Int32Interval | undefined;
  setDurationS(value?: domain_pb.Int32Interval): GetProblemSetsRequest;
  hasDurationS(): boolean;
  clearDurationS(): GetProblemSetsRequest;

  getOffset(): number;
  setOffset(value: number): GetProblemSetsRequest;

  getLimit(): number;
  setLimit(value: number): GetProblemSetsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProblemSetsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetProblemSetsRequest): GetProblemSetsRequest.AsObject;
  static serializeBinaryToWriter(message: GetProblemSetsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetProblemSetsRequest;
  static deserializeBinaryFromReader(message: GetProblemSetsRequest, reader: jspb.BinaryReader): GetProblemSetsRequest;
}

export namespace GetProblemSetsRequest {
  export type AsObject = {
    isPublic: boolean,
    pattern?: google_protobuf_wrappers_pb.StringValue.AsObject,
    tagsList: Array<string>,
    authorId?: google_protobuf_wrappers_pb.StringValue.AsObject,
    problemsCount?: domain_pb.UInt32Interval.AsObject,
    durationS?: domain_pb.Int32Interval.AsObject,
    offset: number,
    limit: number,
  }
}

export class GetProblemSetsReply extends jspb.Message {
  getHeads(): GetProblemSetsReply.HeadList | undefined;
  setHeads(value?: GetProblemSetsReply.HeadList): GetProblemSetsReply;
  hasHeads(): boolean;
  clearHeads(): GetProblemSetsReply;

  getError(): GetProblemSetsReply.Error | undefined;
  setError(value?: GetProblemSetsReply.Error): GetProblemSetsReply;
  hasError(): boolean;
  clearError(): GetProblemSetsReply;

  getResultCase(): GetProblemSetsReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProblemSetsReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetProblemSetsReply): GetProblemSetsReply.AsObject;
  static serializeBinaryToWriter(message: GetProblemSetsReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetProblemSetsReply;
  static deserializeBinaryFromReader(message: GetProblemSetsReply, reader: jspb.BinaryReader): GetProblemSetsReply;
}

export namespace GetProblemSetsReply {
  export type AsObject = {
    heads?: GetProblemSetsReply.HeadList.AsObject,
    error?: GetProblemSetsReply.Error.AsObject,
  }

  export class HeadList extends jspb.Message {
    getHeadsList(): Array<domain_pb.Head>;
    setHeadsList(value: Array<domain_pb.Head>): HeadList;
    clearHeadsList(): HeadList;
    addHeads(value?: domain_pb.Head, index?: number): domain_pb.Head;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HeadList.AsObject;
    static toObject(includeInstance: boolean, msg: HeadList): HeadList.AsObject;
    static serializeBinaryToWriter(message: HeadList, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HeadList;
    static deserializeBinaryFromReader(message: HeadList, reader: jspb.BinaryReader): HeadList;
  }

  export namespace HeadList {
    export type AsObject = {
      headsList: Array<domain_pb.Head.AsObject>,
    }
  }


  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): GetProblemSetsReply.Error.Status;
    setStatus(value: GetProblemSetsReply.Error.Status): Error;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Error.AsObject;
    static toObject(includeInstance: boolean, msg: Error): Error.AsObject;
    static serializeBinaryToWriter(message: Error, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Error;
    static deserializeBinaryFromReader(message: Error, reader: jspb.BinaryReader): Error;
  }

  export namespace Error {
    export type AsObject = {
      description: string,
      status: GetProblemSetsReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
      NO_ACCESS = 1,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    HEADS = 1,
    ERROR = 2,
  }
}

export class ShareReportRequest extends jspb.Message {
  getReportId(): string;
  setReportId(value: string): ShareReportRequest;

  getUserIdsList(): Array<string>;
  setUserIdsList(value: Array<string>): ShareReportRequest;
  clearUserIdsList(): ShareReportRequest;
  addUserIds(value: string, index?: number): ShareReportRequest;

  getGroupIdsList(): Array<string>;
  setGroupIdsList(value: Array<string>): ShareReportRequest;
  clearGroupIdsList(): ShareReportRequest;
  addGroupIds(value: string, index?: number): ShareReportRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ShareReportRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ShareReportRequest): ShareReportRequest.AsObject;
  static serializeBinaryToWriter(message: ShareReportRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ShareReportRequest;
  static deserializeBinaryFromReader(message: ShareReportRequest, reader: jspb.BinaryReader): ShareReportRequest;
}

export namespace ShareReportRequest {
  export type AsObject = {
    reportId: string,
    userIdsList: Array<string>,
    groupIdsList: Array<string>,
  }
}

export class ShareReportReply extends jspb.Message {
  getError(): ShareReportReply.Error | undefined;
  setError(value?: ShareReportReply.Error): ShareReportReply;
  hasError(): boolean;
  clearError(): ShareReportReply;

  getResultCase(): ShareReportReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ShareReportReply.AsObject;
  static toObject(includeInstance: boolean, msg: ShareReportReply): ShareReportReply.AsObject;
  static serializeBinaryToWriter(message: ShareReportReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ShareReportReply;
  static deserializeBinaryFromReader(message: ShareReportReply, reader: jspb.BinaryReader): ShareReportReply;
}

export namespace ShareReportReply {
  export type AsObject = {
    error?: ShareReportReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): ShareReportReply.Error.Status;
    setStatus(value: ShareReportReply.Error.Status): Error;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Error.AsObject;
    static toObject(includeInstance: boolean, msg: Error): Error.AsObject;
    static serializeBinaryToWriter(message: Error, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Error;
    static deserializeBinaryFromReader(message: Error, reader: jspb.BinaryReader): Error;
  }

  export namespace Error {
    export type AsObject = {
      description: string,
      status: ShareReportReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
      NO_ACCESS = 1,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    ERROR = 1,
  }
}

export class GetReportsRequest extends jspb.Message {
  getPattern(): google_protobuf_wrappers_pb.StringValue | undefined;
  setPattern(value?: google_protobuf_wrappers_pb.StringValue): GetReportsRequest;
  hasPattern(): boolean;
  clearPattern(): GetReportsRequest;

  getUserId(): google_protobuf_wrappers_pb.StringValue | undefined;
  setUserId(value?: google_protobuf_wrappers_pb.StringValue): GetReportsRequest;
  hasUserId(): boolean;
  clearUserId(): GetReportsRequest;

  getDateInterval(): domain_pb.DateInterval | undefined;
  setDateInterval(value?: domain_pb.DateInterval): GetReportsRequest;
  hasDateInterval(): boolean;
  clearDateInterval(): GetReportsRequest;

  getOffset(): number;
  setOffset(value: number): GetReportsRequest;

  getLimit(): number;
  setLimit(value: number): GetReportsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetReportsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetReportsRequest): GetReportsRequest.AsObject;
  static serializeBinaryToWriter(message: GetReportsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetReportsRequest;
  static deserializeBinaryFromReader(message: GetReportsRequest, reader: jspb.BinaryReader): GetReportsRequest;
}

export namespace GetReportsRequest {
  export type AsObject = {
    pattern?: google_protobuf_wrappers_pb.StringValue.AsObject,
    userId?: google_protobuf_wrappers_pb.StringValue.AsObject,
    dateInterval?: domain_pb.DateInterval.AsObject,
    offset: number,
    limit: number,
  }
}

export class GetReportsReply extends jspb.Message {
  getReports(): GetReportsReply.ReportsList | undefined;
  setReports(value?: GetReportsReply.ReportsList): GetReportsReply;
  hasReports(): boolean;
  clearReports(): GetReportsReply;

  getError(): GetReportsReply.Error | undefined;
  setError(value?: GetReportsReply.Error): GetReportsReply;
  hasError(): boolean;
  clearError(): GetReportsReply;

  getResultCase(): GetReportsReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetReportsReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetReportsReply): GetReportsReply.AsObject;
  static serializeBinaryToWriter(message: GetReportsReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetReportsReply;
  static deserializeBinaryFromReader(message: GetReportsReply, reader: jspb.BinaryReader): GetReportsReply;
}

export namespace GetReportsReply {
  export type AsObject = {
    reports?: GetReportsReply.ReportsList.AsObject,
    error?: GetReportsReply.Error.AsObject,
  }

  export class ReportsList extends jspb.Message {
    getReportsList(): Array<domain_pb.Report>;
    setReportsList(value: Array<domain_pb.Report>): ReportsList;
    clearReportsList(): ReportsList;
    addReports(value?: domain_pb.Report, index?: number): domain_pb.Report;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ReportsList.AsObject;
    static toObject(includeInstance: boolean, msg: ReportsList): ReportsList.AsObject;
    static serializeBinaryToWriter(message: ReportsList, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ReportsList;
    static deserializeBinaryFromReader(message: ReportsList, reader: jspb.BinaryReader): ReportsList;
  }

  export namespace ReportsList {
    export type AsObject = {
      reportsList: Array<domain_pb.Report.AsObject>,
    }
  }


  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): GetReportsReply.Error.Status;
    setStatus(value: GetReportsReply.Error.Status): Error;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Error.AsObject;
    static toObject(includeInstance: boolean, msg: Error): Error.AsObject;
    static serializeBinaryToWriter(message: Error, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Error;
    static deserializeBinaryFromReader(message: Error, reader: jspb.BinaryReader): Error;
  }

  export namespace Error {
    export type AsObject = {
      description: string,
      status: GetReportsReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
      NO_ACCESS = 1,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    REPORTS = 1,
    ERROR = 2,
  }
}

export class GetSubmissionsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSubmissionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetSubmissionsRequest): GetSubmissionsRequest.AsObject;
  static serializeBinaryToWriter(message: GetSubmissionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSubmissionsRequest;
  static deserializeBinaryFromReader(message: GetSubmissionsRequest, reader: jspb.BinaryReader): GetSubmissionsRequest;
}

export namespace GetSubmissionsRequest {
  export type AsObject = {
  }
}

export class GetSubmissionsReply extends jspb.Message {
  getSubmissions(): GetSubmissionsReply.Submissions | undefined;
  setSubmissions(value?: GetSubmissionsReply.Submissions): GetSubmissionsReply;
  hasSubmissions(): boolean;
  clearSubmissions(): GetSubmissionsReply;

  getError(): GetSubmissionsReply.Error | undefined;
  setError(value?: GetSubmissionsReply.Error): GetSubmissionsReply;
  hasError(): boolean;
  clearError(): GetSubmissionsReply;

  getResultCase(): GetSubmissionsReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSubmissionsReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetSubmissionsReply): GetSubmissionsReply.AsObject;
  static serializeBinaryToWriter(message: GetSubmissionsReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSubmissionsReply;
  static deserializeBinaryFromReader(message: GetSubmissionsReply, reader: jspb.BinaryReader): GetSubmissionsReply;
}

export namespace GetSubmissionsReply {
  export type AsObject = {
    submissions?: GetSubmissionsReply.Submissions.AsObject,
    error?: GetSubmissionsReply.Error.AsObject,
  }

  export class Submissions extends jspb.Message {
    getSubmissionIdsList(): Array<string>;
    setSubmissionIdsList(value: Array<string>): Submissions;
    clearSubmissionIdsList(): Submissions;
    addSubmissionIds(value: string, index?: number): Submissions;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Submissions.AsObject;
    static toObject(includeInstance: boolean, msg: Submissions): Submissions.AsObject;
    static serializeBinaryToWriter(message: Submissions, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Submissions;
    static deserializeBinaryFromReader(message: Submissions, reader: jspb.BinaryReader): Submissions;
  }

  export namespace Submissions {
    export type AsObject = {
      submissionIdsList: Array<string>,
    }
  }


  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): GetSubmissionsReply.Error.Status;
    setStatus(value: GetSubmissionsReply.Error.Status): Error;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Error.AsObject;
    static toObject(includeInstance: boolean, msg: Error): Error.AsObject;
    static serializeBinaryToWriter(message: Error, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Error;
    static deserializeBinaryFromReader(message: Error, reader: jspb.BinaryReader): Error;
  }

  export namespace Error {
    export type AsObject = {
      description: string,
      status: GetSubmissionsReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    SUBMISSIONS = 1,
    ERROR = 2,
  }
}

export class GetReportRequest extends jspb.Message {
  getReportId(): string;
  setReportId(value: string): GetReportRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetReportRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetReportRequest): GetReportRequest.AsObject;
  static serializeBinaryToWriter(message: GetReportRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetReportRequest;
  static deserializeBinaryFromReader(message: GetReportRequest, reader: jspb.BinaryReader): GetReportRequest;
}

export namespace GetReportRequest {
  export type AsObject = {
    reportId: string,
  }
}

export class GetReportReply extends jspb.Message {
  getReport(): domain_pb.Report | undefined;
  setReport(value?: domain_pb.Report): GetReportReply;
  hasReport(): boolean;
  clearReport(): GetReportReply;

  getError(): GetReportReply.Error | undefined;
  setError(value?: GetReportReply.Error): GetReportReply;
  hasError(): boolean;
  clearError(): GetReportReply;

  getResultCase(): GetReportReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetReportReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetReportReply): GetReportReply.AsObject;
  static serializeBinaryToWriter(message: GetReportReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetReportReply;
  static deserializeBinaryFromReader(message: GetReportReply, reader: jspb.BinaryReader): GetReportReply;
}

export namespace GetReportReply {
  export type AsObject = {
    report?: domain_pb.Report.AsObject,
    error?: GetReportReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): GetReportReply.Error.Status;
    setStatus(value: GetReportReply.Error.Status): Error;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Error.AsObject;
    static toObject(includeInstance: boolean, msg: Error): Error.AsObject;
    static serializeBinaryToWriter(message: Error, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Error;
    static deserializeBinaryFromReader(message: Error, reader: jspb.BinaryReader): Error;
  }

  export namespace Error {
    export type AsObject = {
      description: string,
      status: GetReportReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
      NO_ACCESS = 1,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    REPORT = 1,
    ERROR = 2,
  }
}

export class StartSubmissionRequest extends jspb.Message {
  getProblemSetHeadId(): string;
  setProblemSetHeadId(value: string): StartSubmissionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StartSubmissionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StartSubmissionRequest): StartSubmissionRequest.AsObject;
  static serializeBinaryToWriter(message: StartSubmissionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StartSubmissionRequest;
  static deserializeBinaryFromReader(message: StartSubmissionRequest, reader: jspb.BinaryReader): StartSubmissionRequest;
}

export namespace StartSubmissionRequest {
  export type AsObject = {
    problemSetHeadId: string,
  }
}

export class StartSubmissionReply extends jspb.Message {
  getSubmissionId(): string;
  setSubmissionId(value: string): StartSubmissionReply;

  getError(): StartSubmissionReply.Error | undefined;
  setError(value?: StartSubmissionReply.Error): StartSubmissionReply;
  hasError(): boolean;
  clearError(): StartSubmissionReply;

  getResultCase(): StartSubmissionReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StartSubmissionReply.AsObject;
  static toObject(includeInstance: boolean, msg: StartSubmissionReply): StartSubmissionReply.AsObject;
  static serializeBinaryToWriter(message: StartSubmissionReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StartSubmissionReply;
  static deserializeBinaryFromReader(message: StartSubmissionReply, reader: jspb.BinaryReader): StartSubmissionReply;
}

export namespace StartSubmissionReply {
  export type AsObject = {
    submissionId: string,
    error?: StartSubmissionReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): StartSubmissionReply.Error.Status;
    setStatus(value: StartSubmissionReply.Error.Status): Error;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Error.AsObject;
    static toObject(includeInstance: boolean, msg: Error): Error.AsObject;
    static serializeBinaryToWriter(message: Error, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Error;
    static deserializeBinaryFromReader(message: Error, reader: jspb.BinaryReader): Error;
  }

  export namespace Error {
    export type AsObject = {
      description: string,
      status: StartSubmissionReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
      NO_ACCESS = 1,
      HEAD_NOT_FOUND = 2,
      WRONG_HEAD_TYPE = 3,
      CANNOT_START_SUBMISSION = 4,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    SUBMISSION_ID = 1,
    ERROR = 2,
  }
}

export class CompleteSubmissionRequest extends jspb.Message {
  getSubmissionId(): string;
  setSubmissionId(value: string): CompleteSubmissionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CompleteSubmissionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CompleteSubmissionRequest): CompleteSubmissionRequest.AsObject;
  static serializeBinaryToWriter(message: CompleteSubmissionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CompleteSubmissionRequest;
  static deserializeBinaryFromReader(message: CompleteSubmissionRequest, reader: jspb.BinaryReader): CompleteSubmissionRequest;
}

export namespace CompleteSubmissionRequest {
  export type AsObject = {
    submissionId: string,
  }
}

export class CompleteSubmissionReply extends jspb.Message {
  getReportId(): string;
  setReportId(value: string): CompleteSubmissionReply;

  getError(): CompleteSubmissionReply.Error | undefined;
  setError(value?: CompleteSubmissionReply.Error): CompleteSubmissionReply;
  hasError(): boolean;
  clearError(): CompleteSubmissionReply;

  getResultCase(): CompleteSubmissionReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CompleteSubmissionReply.AsObject;
  static toObject(includeInstance: boolean, msg: CompleteSubmissionReply): CompleteSubmissionReply.AsObject;
  static serializeBinaryToWriter(message: CompleteSubmissionReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CompleteSubmissionReply;
  static deserializeBinaryFromReader(message: CompleteSubmissionReply, reader: jspb.BinaryReader): CompleteSubmissionReply;
}

export namespace CompleteSubmissionReply {
  export type AsObject = {
    reportId: string,
    error?: CompleteSubmissionReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): CompleteSubmissionReply.Error.Status;
    setStatus(value: CompleteSubmissionReply.Error.Status): Error;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Error.AsObject;
    static toObject(includeInstance: boolean, msg: Error): Error.AsObject;
    static serializeBinaryToWriter(message: Error, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Error;
    static deserializeBinaryFromReader(message: Error, reader: jspb.BinaryReader): Error;
  }

  export namespace Error {
    export type AsObject = {
      description: string,
      status: CompleteSubmissionReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
      NO_ACCESS = 1,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    REPORT_ID = 1,
    ERROR = 2,
  }
}

export class GetSubmissionRequest extends jspb.Message {
  getSubmissionId(): string;
  setSubmissionId(value: string): GetSubmissionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSubmissionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetSubmissionRequest): GetSubmissionRequest.AsObject;
  static serializeBinaryToWriter(message: GetSubmissionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSubmissionRequest;
  static deserializeBinaryFromReader(message: GetSubmissionRequest, reader: jspb.BinaryReader): GetSubmissionRequest;
}

export namespace GetSubmissionRequest {
  export type AsObject = {
    submissionId: string,
  }
}

export class GetSubmissionReply extends jspb.Message {
  getSubmission(): domain_pb.Submission | undefined;
  setSubmission(value?: domain_pb.Submission): GetSubmissionReply;
  hasSubmission(): boolean;
  clearSubmission(): GetSubmissionReply;

  getError(): GetSubmissionReply.Error | undefined;
  setError(value?: GetSubmissionReply.Error): GetSubmissionReply;
  hasError(): boolean;
  clearError(): GetSubmissionReply;

  getResultCase(): GetSubmissionReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSubmissionReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetSubmissionReply): GetSubmissionReply.AsObject;
  static serializeBinaryToWriter(message: GetSubmissionReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSubmissionReply;
  static deserializeBinaryFromReader(message: GetSubmissionReply, reader: jspb.BinaryReader): GetSubmissionReply;
}

export namespace GetSubmissionReply {
  export type AsObject = {
    submission?: domain_pb.Submission.AsObject,
    error?: GetSubmissionReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): GetSubmissionReply.Error.Status;
    setStatus(value: GetSubmissionReply.Error.Status): Error;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Error.AsObject;
    static toObject(includeInstance: boolean, msg: Error): Error.AsObject;
    static serializeBinaryToWriter(message: Error, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Error;
    static deserializeBinaryFromReader(message: Error, reader: jspb.BinaryReader): Error;
  }

  export namespace Error {
    export type AsObject = {
      description: string,
      status: GetSubmissionReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
      NO_ACCESS = 1,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    SUBMISSION = 1,
    ERROR = 2,
  }
}

export class ApplyAnswerRequest extends jspb.Message {
  getSubmissionId(): string;
  setSubmissionId(value: string): ApplyAnswerRequest;

  getGeneratedProblemId(): string;
  setGeneratedProblemId(value: string): ApplyAnswerRequest;

  getAnswer(): string;
  setAnswer(value: string): ApplyAnswerRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplyAnswerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ApplyAnswerRequest): ApplyAnswerRequest.AsObject;
  static serializeBinaryToWriter(message: ApplyAnswerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplyAnswerRequest;
  static deserializeBinaryFromReader(message: ApplyAnswerRequest, reader: jspb.BinaryReader): ApplyAnswerRequest;
}

export namespace ApplyAnswerRequest {
  export type AsObject = {
    submissionId: string,
    generatedProblemId: string,
    answer: string,
  }
}

export class ApplyAnswerReply extends jspb.Message {
  getError(): ApplyAnswerReply.Error | undefined;
  setError(value?: ApplyAnswerReply.Error): ApplyAnswerReply;
  hasError(): boolean;
  clearError(): ApplyAnswerReply;

  getResultCase(): ApplyAnswerReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplyAnswerReply.AsObject;
  static toObject(includeInstance: boolean, msg: ApplyAnswerReply): ApplyAnswerReply.AsObject;
  static serializeBinaryToWriter(message: ApplyAnswerReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplyAnswerReply;
  static deserializeBinaryFromReader(message: ApplyAnswerReply, reader: jspb.BinaryReader): ApplyAnswerReply;
}

export namespace ApplyAnswerReply {
  export type AsObject = {
    error?: ApplyAnswerReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): ApplyAnswerReply.Error.Status;
    setStatus(value: ApplyAnswerReply.Error.Status): Error;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Error.AsObject;
    static toObject(includeInstance: boolean, msg: Error): Error.AsObject;
    static serializeBinaryToWriter(message: Error, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Error;
    static deserializeBinaryFromReader(message: Error, reader: jspb.BinaryReader): Error;
  }

  export namespace Error {
    export type AsObject = {
      description: string,
      status: ApplyAnswerReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
      NO_ACCESS = 1,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    ERROR = 1,
  }
}

