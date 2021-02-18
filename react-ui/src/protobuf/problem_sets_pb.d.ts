import * as jspb from 'google-protobuf'

import * as domain_pb from './domain_pb';


export class UpdateProblemSetReply extends jspb.Message {
  getCommitId(): string;
  setCommitId(value: string): UpdateProblemSetReply;

  getError(): UpdateProblemSetReply.Error | undefined;
  setError(value?: UpdateProblemSetReply.Error): UpdateProblemSetReply;
  hasError(): boolean;
  clearError(): UpdateProblemSetReply;

  getResultCase(): UpdateProblemSetReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateProblemSetReply.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateProblemSetReply): UpdateProblemSetReply.AsObject;
  static serializeBinaryToWriter(message: UpdateProblemSetReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateProblemSetReply;
  static deserializeBinaryFromReader(message: UpdateProblemSetReply, reader: jspb.BinaryReader): UpdateProblemSetReply;
}

export namespace UpdateProblemSetReply {
  export type AsObject = {
    commitId: string,
    error?: UpdateProblemSetReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): UpdateProblemSetReply.Error.Status;
    setStatus(value: UpdateProblemSetReply.Error.Status): Error;

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
      status: UpdateProblemSetReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
      NO_ACCESS = 1,
      INVALID_INPUT = 2,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    COMMIT_ID = 1,
    ERROR = 2,
  }
}

export class UpdateProblemSetRequest extends jspb.Message {
  getHeadId(): string;
  setHeadId(value: string): UpdateProblemSetRequest;

  getDescription(): string;
  setDescription(value: string): UpdateProblemSetRequest;

  getProblemSet(): domain_pb.ProblemSet | undefined;
  setProblemSet(value?: domain_pb.ProblemSet): UpdateProblemSetRequest;
  hasProblemSet(): boolean;
  clearProblemSet(): UpdateProblemSetRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateProblemSetRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateProblemSetRequest): UpdateProblemSetRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateProblemSetRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateProblemSetRequest;
  static deserializeBinaryFromReader(message: UpdateProblemSetRequest, reader: jspb.BinaryReader): UpdateProblemSetRequest;
}

export namespace UpdateProblemSetRequest {
  export type AsObject = {
    headId: string,
    description: string,
    problemSet?: domain_pb.ProblemSet.AsObject,
  }
}

export class CreateProblemSetReply extends jspb.Message {
  getHeadId(): string;
  setHeadId(value: string): CreateProblemSetReply;

  getError(): CreateProblemSetReply.Error | undefined;
  setError(value?: CreateProblemSetReply.Error): CreateProblemSetReply;
  hasError(): boolean;
  clearError(): CreateProblemSetReply;

  getResultCase(): CreateProblemSetReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateProblemSetReply.AsObject;
  static toObject(includeInstance: boolean, msg: CreateProblemSetReply): CreateProblemSetReply.AsObject;
  static serializeBinaryToWriter(message: CreateProblemSetReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateProblemSetReply;
  static deserializeBinaryFromReader(message: CreateProblemSetReply, reader: jspb.BinaryReader): CreateProblemSetReply;
}

export namespace CreateProblemSetReply {
  export type AsObject = {
    headId: string,
    error?: CreateProblemSetReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): CreateProblemSetReply.Error.Status;
    setStatus(value: CreateProblemSetReply.Error.Status): Error;

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
      status: CreateProblemSetReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
      NO_ACCESS = 1,
      INVALID_INPUT = 2,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    HEAD_ID = 1,
    ERROR = 2,
  }
}

export class CreateProblemSetRequest extends jspb.Message {
  getFolderId(): string;
  setFolderId(value: string): CreateProblemSetRequest;

  getName(): string;
  setName(value: string): CreateProblemSetRequest;

  getProblemSet(): domain_pb.ProblemSet | undefined;
  setProblemSet(value?: domain_pb.ProblemSet): CreateProblemSetRequest;
  hasProblemSet(): boolean;
  clearProblemSet(): CreateProblemSetRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateProblemSetRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateProblemSetRequest): CreateProblemSetRequest.AsObject;
  static serializeBinaryToWriter(message: CreateProblemSetRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateProblemSetRequest;
  static deserializeBinaryFromReader(message: CreateProblemSetRequest, reader: jspb.BinaryReader): CreateProblemSetRequest;
}

export namespace CreateProblemSetRequest {
  export type AsObject = {
    folderId: string,
    name: string,
    problemSet?: domain_pb.ProblemSet.AsObject,
  }
}

export class GetProblemSetReply extends jspb.Message {
  getProblemSet(): domain_pb.ProblemSet | undefined;
  setProblemSet(value?: domain_pb.ProblemSet): GetProblemSetReply;
  hasProblemSet(): boolean;
  clearProblemSet(): GetProblemSetReply;

  getError(): GetProblemSetReply.Error | undefined;
  setError(value?: GetProblemSetReply.Error): GetProblemSetReply;
  hasError(): boolean;
  clearError(): GetProblemSetReply;

  getResultCase(): GetProblemSetReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProblemSetReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetProblemSetReply): GetProblemSetReply.AsObject;
  static serializeBinaryToWriter(message: GetProblemSetReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetProblemSetReply;
  static deserializeBinaryFromReader(message: GetProblemSetReply, reader: jspb.BinaryReader): GetProblemSetReply;
}

export namespace GetProblemSetReply {
  export type AsObject = {
    problemSet?: domain_pb.ProblemSet.AsObject,
    error?: GetProblemSetReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): GetProblemSetReply.Error.Status;
    setStatus(value: GetProblemSetReply.Error.Status): Error;

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
      status: GetProblemSetReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
      NO_ACCESS = 1,
      NO_COMMIT = 2,
      INVALID_TYPE = 3,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    PROBLEM_SET = 1,
    ERROR = 2,
  }
}

export class GetProblemSetRequest extends jspb.Message {
  getCommitId(): string;
  setCommitId(value: string): GetProblemSetRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProblemSetRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetProblemSetRequest): GetProblemSetRequest.AsObject;
  static serializeBinaryToWriter(message: GetProblemSetRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetProblemSetRequest;
  static deserializeBinaryFromReader(message: GetProblemSetRequest, reader: jspb.BinaryReader): GetProblemSetRequest;
}

export namespace GetProblemSetRequest {
  export type AsObject = {
    commitId: string,
  }
}

