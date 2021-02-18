import * as jspb from 'google-protobuf'

import * as domain_pb from './domain_pb';


export class UpdateProblemReply extends jspb.Message {
  getCommitId(): string;
  setCommitId(value: string): UpdateProblemReply;

  getError(): UpdateProblemReply.Error | undefined;
  setError(value?: UpdateProblemReply.Error): UpdateProblemReply;
  hasError(): boolean;
  clearError(): UpdateProblemReply;

  getResultCase(): UpdateProblemReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateProblemReply.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateProblemReply): UpdateProblemReply.AsObject;
  static serializeBinaryToWriter(message: UpdateProblemReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateProblemReply;
  static deserializeBinaryFromReader(message: UpdateProblemReply, reader: jspb.BinaryReader): UpdateProblemReply;
}

export namespace UpdateProblemReply {
  export type AsObject = {
    commitId: string,
    error?: UpdateProblemReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): UpdateProblemReply.Error.Status;
    setStatus(value: UpdateProblemReply.Error.Status): Error;

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
      status: UpdateProblemReply.Error.Status,
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

export class UpdateProblemRequest extends jspb.Message {
  getHeadId(): string;
  setHeadId(value: string): UpdateProblemRequest;

  getDescription(): string;
  setDescription(value: string): UpdateProblemRequest;

  getProblem(): domain_pb.Problem | undefined;
  setProblem(value?: domain_pb.Problem): UpdateProblemRequest;
  hasProblem(): boolean;
  clearProblem(): UpdateProblemRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateProblemRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateProblemRequest): UpdateProblemRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateProblemRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateProblemRequest;
  static deserializeBinaryFromReader(message: UpdateProblemRequest, reader: jspb.BinaryReader): UpdateProblemRequest;
}

export namespace UpdateProblemRequest {
  export type AsObject = {
    headId: string,
    description: string,
    problem?: domain_pb.Problem.AsObject,
  }
}

export class CreateProblemReply extends jspb.Message {
  getHeadId(): string;
  setHeadId(value: string): CreateProblemReply;

  getError(): CreateProblemReply.Error | undefined;
  setError(value?: CreateProblemReply.Error): CreateProblemReply;
  hasError(): boolean;
  clearError(): CreateProblemReply;

  getResultCase(): CreateProblemReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateProblemReply.AsObject;
  static toObject(includeInstance: boolean, msg: CreateProblemReply): CreateProblemReply.AsObject;
  static serializeBinaryToWriter(message: CreateProblemReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateProblemReply;
  static deserializeBinaryFromReader(message: CreateProblemReply, reader: jspb.BinaryReader): CreateProblemReply;
}

export namespace CreateProblemReply {
  export type AsObject = {
    headId: string,
    error?: CreateProblemReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): CreateProblemReply.Error.Status;
    setStatus(value: CreateProblemReply.Error.Status): Error;

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
      status: CreateProblemReply.Error.Status,
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

export class CreateProblemRequest extends jspb.Message {
  getFolderId(): string;
  setFolderId(value: string): CreateProblemRequest;

  getName(): string;
  setName(value: string): CreateProblemRequest;

  getProblem(): domain_pb.Problem | undefined;
  setProblem(value?: domain_pb.Problem): CreateProblemRequest;
  hasProblem(): boolean;
  clearProblem(): CreateProblemRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateProblemRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateProblemRequest): CreateProblemRequest.AsObject;
  static serializeBinaryToWriter(message: CreateProblemRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateProblemRequest;
  static deserializeBinaryFromReader(message: CreateProblemRequest, reader: jspb.BinaryReader): CreateProblemRequest;
}

export namespace CreateProblemRequest {
  export type AsObject = {
    folderId: string,
    name: string,
    problem?: domain_pb.Problem.AsObject,
  }
}

export class ValidateReply extends jspb.Message {
  getIsCorrect(): boolean;
  setIsCorrect(value: boolean): ValidateReply;

  getError(): ValidateReply.Error | undefined;
  setError(value?: ValidateReply.Error): ValidateReply;
  hasError(): boolean;
  clearError(): ValidateReply;

  getResultCase(): ValidateReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateReply.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateReply): ValidateReply.AsObject;
  static serializeBinaryToWriter(message: ValidateReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateReply;
  static deserializeBinaryFromReader(message: ValidateReply, reader: jspb.BinaryReader): ValidateReply;
}

export namespace ValidateReply {
  export type AsObject = {
    isCorrect: boolean,
    error?: ValidateReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): ValidateReply.Error.Status;
    setStatus(value: ValidateReply.Error.Status): Error;

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
      status: ValidateReply.Error.Status,
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
    IS_CORRECT = 1,
    ERROR = 2,
  }
}

export class ValidateRequest extends jspb.Message {
  getCommitId(): string;
  setCommitId(value: string): ValidateRequest;

  getActualAnswer(): string;
  setActualAnswer(value: string): ValidateRequest;

  getExpectedAnswer(): string;
  setExpectedAnswer(value: string): ValidateRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateRequest): ValidateRequest.AsObject;
  static serializeBinaryToWriter(message: ValidateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateRequest;
  static deserializeBinaryFromReader(message: ValidateRequest, reader: jspb.BinaryReader): ValidateRequest;
}

export namespace ValidateRequest {
  export type AsObject = {
    commitId: string,
    actualAnswer: string,
    expectedAnswer: string,
  }
}

export class TestProblemReply extends jspb.Message {
  getProblem(): domain_pb.GeneratedProblem | undefined;
  setProblem(value?: domain_pb.GeneratedProblem): TestProblemReply;
  hasProblem(): boolean;
  clearProblem(): TestProblemReply;

  getError(): TestProblemReply.Error | undefined;
  setError(value?: TestProblemReply.Error): TestProblemReply;
  hasError(): boolean;
  clearError(): TestProblemReply;

  getResultCase(): TestProblemReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TestProblemReply.AsObject;
  static toObject(includeInstance: boolean, msg: TestProblemReply): TestProblemReply.AsObject;
  static serializeBinaryToWriter(message: TestProblemReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TestProblemReply;
  static deserializeBinaryFromReader(message: TestProblemReply, reader: jspb.BinaryReader): TestProblemReply;
}

export namespace TestProblemReply {
  export type AsObject = {
    problem?: domain_pb.GeneratedProblem.AsObject,
    error?: TestProblemReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): TestProblemReply.Error.Status;
    setStatus(value: TestProblemReply.Error.Status): Error;

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
      status: TestProblemReply.Error.Status,
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
    PROBLEM = 1,
    ERROR = 2,
  }
}

export class TestProblemRequest extends jspb.Message {
  getCommitId(): string;
  setCommitId(value: string): TestProblemRequest;

  getSeed(): number;
  setSeed(value: number): TestProblemRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TestProblemRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TestProblemRequest): TestProblemRequest.AsObject;
  static serializeBinaryToWriter(message: TestProblemRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TestProblemRequest;
  static deserializeBinaryFromReader(message: TestProblemRequest, reader: jspb.BinaryReader): TestProblemRequest;
}

export namespace TestProblemRequest {
  export type AsObject = {
    commitId: string,
    seed: number,
  }
}

export class GetProblemReply extends jspb.Message {
  getProblem(): domain_pb.Problem | undefined;
  setProblem(value?: domain_pb.Problem): GetProblemReply;
  hasProblem(): boolean;
  clearProblem(): GetProblemReply;

  getError(): GetProblemReply.Error | undefined;
  setError(value?: GetProblemReply.Error): GetProblemReply;
  hasError(): boolean;
  clearError(): GetProblemReply;

  getResultCase(): GetProblemReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProblemReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetProblemReply): GetProblemReply.AsObject;
  static serializeBinaryToWriter(message: GetProblemReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetProblemReply;
  static deserializeBinaryFromReader(message: GetProblemReply, reader: jspb.BinaryReader): GetProblemReply;
}

export namespace GetProblemReply {
  export type AsObject = {
    problem?: domain_pb.Problem.AsObject,
    error?: GetProblemReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): GetProblemReply.Error.Status;
    setStatus(value: GetProblemReply.Error.Status): Error;

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
      status: GetProblemReply.Error.Status,
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
    PROBLEM = 1,
    ERROR = 2,
  }
}

export class GetProblemRequest extends jspb.Message {
  getCommitId(): string;
  setCommitId(value: string): GetProblemRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProblemRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetProblemRequest): GetProblemRequest.AsObject;
  static serializeBinaryToWriter(message: GetProblemRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetProblemRequest;
  static deserializeBinaryFromReader(message: GetProblemRequest, reader: jspb.BinaryReader): GetProblemRequest;
}

export namespace GetProblemRequest {
  export type AsObject = {
    commitId: string,
  }
}

