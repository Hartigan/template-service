import * as jspb from 'google-protobuf'

import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';
import * as domain_pb from './domain_pb';


export class UpdateTagsReply extends jspb.Message {
  getError(): UpdateTagsReply.Error | undefined;
  setError(value?: UpdateTagsReply.Error): UpdateTagsReply;
  hasError(): boolean;
  clearError(): UpdateTagsReply;

  getResultCase(): UpdateTagsReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateTagsReply.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateTagsReply): UpdateTagsReply.AsObject;
  static serializeBinaryToWriter(message: UpdateTagsReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateTagsReply;
  static deserializeBinaryFromReader(message: UpdateTagsReply, reader: jspb.BinaryReader): UpdateTagsReply;
}

export namespace UpdateTagsReply {
  export type AsObject = {
    error?: UpdateTagsReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): UpdateTagsReply.Error.Status;
    setStatus(value: UpdateTagsReply.Error.Status): Error;

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
      status: UpdateTagsReply.Error.Status,
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

export class UpdateTagsRequest extends jspb.Message {
  getHeadId(): string;
  setHeadId(value: string): UpdateTagsRequest;

  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): UpdateTagsRequest;
  clearTagsList(): UpdateTagsRequest;
  addTags(value: string, index?: number): UpdateTagsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateTagsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateTagsRequest): UpdateTagsRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateTagsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateTagsRequest;
  static deserializeBinaryFromReader(message: UpdateTagsRequest, reader: jspb.BinaryReader): UpdateTagsRequest;
}

export namespace UpdateTagsRequest {
  export type AsObject = {
    headId: string,
    tagsList: Array<string>,
  }
}

export class SearchReply extends jspb.Message {
  getHeads(): SearchReply.HeadList | undefined;
  setHeads(value?: SearchReply.HeadList): SearchReply;
  hasHeads(): boolean;
  clearHeads(): SearchReply;

  getError(): SearchReply.Error | undefined;
  setError(value?: SearchReply.Error): SearchReply;
  hasError(): boolean;
  clearError(): SearchReply;

  getResultCase(): SearchReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchReply.AsObject;
  static toObject(includeInstance: boolean, msg: SearchReply): SearchReply.AsObject;
  static serializeBinaryToWriter(message: SearchReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchReply;
  static deserializeBinaryFromReader(message: SearchReply, reader: jspb.BinaryReader): SearchReply;
}

export namespace SearchReply {
  export type AsObject = {
    heads?: SearchReply.HeadList.AsObject,
    error?: SearchReply.Error.AsObject,
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

    getStatus(): SearchReply.Error.Status;
    setStatus(value: SearchReply.Error.Status): Error;

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
      status: SearchReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    HEADS = 1,
    ERROR = 2,
  }
}

export class SearchRequest extends jspb.Message {
  getOwnerId(): google_protobuf_wrappers_pb.StringValue | undefined;
  setOwnerId(value?: google_protobuf_wrappers_pb.StringValue): SearchRequest;
  hasOwnerId(): boolean;
  clearOwnerId(): SearchRequest;

  getPattern(): google_protobuf_wrappers_pb.StringValue | undefined;
  setPattern(value?: google_protobuf_wrappers_pb.StringValue): SearchRequest;
  hasPattern(): boolean;
  clearPattern(): SearchRequest;

  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): SearchRequest;
  clearTagsList(): SearchRequest;
  addTags(value: string, index?: number): SearchRequest;

  getOffset(): number;
  setOffset(value: number): SearchRequest;

  getLimit(): number;
  setLimit(value: number): SearchRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchRequest): SearchRequest.AsObject;
  static serializeBinaryToWriter(message: SearchRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchRequest;
  static deserializeBinaryFromReader(message: SearchRequest, reader: jspb.BinaryReader): SearchRequest;
}

export namespace SearchRequest {
  export type AsObject = {
    ownerId?: google_protobuf_wrappers_pb.StringValue.AsObject,
    pattern?: google_protobuf_wrappers_pb.StringValue.AsObject,
    tagsList: Array<string>,
    offset: number,
    limit: number,
  }
}

export class GetCommitReply extends jspb.Message {
  getCommit(): domain_pb.Commit | undefined;
  setCommit(value?: domain_pb.Commit): GetCommitReply;
  hasCommit(): boolean;
  clearCommit(): GetCommitReply;

  getError(): GetCommitReply.Error | undefined;
  setError(value?: GetCommitReply.Error): GetCommitReply;
  hasError(): boolean;
  clearError(): GetCommitReply;

  getResultCase(): GetCommitReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCommitReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetCommitReply): GetCommitReply.AsObject;
  static serializeBinaryToWriter(message: GetCommitReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCommitReply;
  static deserializeBinaryFromReader(message: GetCommitReply, reader: jspb.BinaryReader): GetCommitReply;
}

export namespace GetCommitReply {
  export type AsObject = {
    commit?: domain_pb.Commit.AsObject,
    error?: GetCommitReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): GetCommitReply.Error.Status;
    setStatus(value: GetCommitReply.Error.Status): Error;

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
      status: GetCommitReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
      NO_ACCESS = 1,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    COMMIT = 1,
    ERROR = 2,
  }
}

export class GetCommitRequest extends jspb.Message {
  getCommitId(): string;
  setCommitId(value: string): GetCommitRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCommitRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCommitRequest): GetCommitRequest.AsObject;
  static serializeBinaryToWriter(message: GetCommitRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCommitRequest;
  static deserializeBinaryFromReader(message: GetCommitRequest, reader: jspb.BinaryReader): GetCommitRequest;
}

export namespace GetCommitRequest {
  export type AsObject = {
    commitId: string,
  }
}

export class GetHeadsReply extends jspb.Message {
  getEntriesList(): Array<GetHeadsReply.Entry>;
  setEntriesList(value: Array<GetHeadsReply.Entry>): GetHeadsReply;
  clearEntriesList(): GetHeadsReply;
  addEntries(value?: GetHeadsReply.Entry, index?: number): GetHeadsReply.Entry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetHeadsReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetHeadsReply): GetHeadsReply.AsObject;
  static serializeBinaryToWriter(message: GetHeadsReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetHeadsReply;
  static deserializeBinaryFromReader(message: GetHeadsReply, reader: jspb.BinaryReader): GetHeadsReply;
}

export namespace GetHeadsReply {
  export type AsObject = {
    entriesList: Array<GetHeadsReply.Entry.AsObject>,
  }

  export class Entry extends jspb.Message {
    getHeadId(): string;
    setHeadId(value: string): Entry;

    getStatus(): GetHeadsReply.Status;
    setStatus(value: GetHeadsReply.Status): Entry;

    getHead(): domain_pb.Head | undefined;
    setHead(value?: domain_pb.Head): Entry;
    hasHead(): boolean;
    clearHead(): Entry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Entry.AsObject;
    static toObject(includeInstance: boolean, msg: Entry): Entry.AsObject;
    static serializeBinaryToWriter(message: Entry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Entry;
    static deserializeBinaryFromReader(message: Entry, reader: jspb.BinaryReader): Entry;
  }

  export namespace Entry {
    export type AsObject = {
      headId: string,
      status: GetHeadsReply.Status,
      head?: domain_pb.Head.AsObject,
    }
  }


  export enum Status { 
    OK = 0,
    UNKNOWN = 1,
    NO_ACCESS = 2,
  }
}

export class GetHeadsRequest extends jspb.Message {
  getHeadIdsList(): Array<string>;
  setHeadIdsList(value: Array<string>): GetHeadsRequest;
  clearHeadIdsList(): GetHeadsRequest;
  addHeadIds(value: string, index?: number): GetHeadsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetHeadsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetHeadsRequest): GetHeadsRequest.AsObject;
  static serializeBinaryToWriter(message: GetHeadsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetHeadsRequest;
  static deserializeBinaryFromReader(message: GetHeadsRequest, reader: jspb.BinaryReader): GetHeadsRequest;
}

export namespace GetHeadsRequest {
  export type AsObject = {
    headIdsList: Array<string>,
  }
}

