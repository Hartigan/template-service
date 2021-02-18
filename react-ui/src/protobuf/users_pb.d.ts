import * as jspb from 'google-protobuf'

import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';
import * as domain_pb from './domain_pb';


export class SearchReply extends jspb.Message {
  getUsers(): SearchReply.UserList | undefined;
  setUsers(value?: SearchReply.UserList): SearchReply;
  hasUsers(): boolean;
  clearUsers(): SearchReply;

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
    users?: SearchReply.UserList.AsObject,
    error?: SearchReply.Error.AsObject,
  }

  export class UserList extends jspb.Message {
    getUsersList(): Array<domain_pb.User>;
    setUsersList(value: Array<domain_pb.User>): UserList;
    clearUsersList(): UserList;
    addUsers(value?: domain_pb.User, index?: number): domain_pb.User;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UserList.AsObject;
    static toObject(includeInstance: boolean, msg: UserList): UserList.AsObject;
    static serializeBinaryToWriter(message: UserList, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UserList;
    static deserializeBinaryFromReader(message: UserList, reader: jspb.BinaryReader): UserList;
  }

  export namespace UserList {
    export type AsObject = {
      usersList: Array<domain_pb.User.AsObject>,
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
    USERS = 1,
    ERROR = 2,
  }
}

export class SearchRequest extends jspb.Message {
  getPattern(): google_protobuf_wrappers_pb.StringValue | undefined;
  setPattern(value?: google_protobuf_wrappers_pb.StringValue): SearchRequest;
  hasPattern(): boolean;
  clearPattern(): SearchRequest;

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
    pattern?: google_protobuf_wrappers_pb.StringValue.AsObject,
    offset: number,
    limit: number,
  }
}

export class InitReply extends jspb.Message {
  getError(): InitReply.Error | undefined;
  setError(value?: InitReply.Error): InitReply;
  hasError(): boolean;
  clearError(): InitReply;

  getResultCase(): InitReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitReply.AsObject;
  static toObject(includeInstance: boolean, msg: InitReply): InitReply.AsObject;
  static serializeBinaryToWriter(message: InitReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitReply;
  static deserializeBinaryFromReader(message: InitReply, reader: jspb.BinaryReader): InitReply;
}

export namespace InitReply {
  export type AsObject = {
    error?: InitReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): InitReply.Error.Status;
    setStatus(value: InitReply.Error.Status): Error;

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
      status: InitReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    ERROR = 1,
  }
}

export class InitRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InitRequest): InitRequest.AsObject;
  static serializeBinaryToWriter(message: InitRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitRequest;
  static deserializeBinaryFromReader(message: InitRequest, reader: jspb.BinaryReader): InitRequest;
}

export namespace InitRequest {
  export type AsObject = {
  }
}

export class GetUserReply extends jspb.Message {
  getUser(): domain_pb.User | undefined;
  setUser(value?: domain_pb.User): GetUserReply;
  hasUser(): boolean;
  clearUser(): GetUserReply;

  getError(): GetUserReply.Error | undefined;
  setError(value?: GetUserReply.Error): GetUserReply;
  hasError(): boolean;
  clearError(): GetUserReply;

  getResultCase(): GetUserReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserReply): GetUserReply.AsObject;
  static serializeBinaryToWriter(message: GetUserReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserReply;
  static deserializeBinaryFromReader(message: GetUserReply, reader: jspb.BinaryReader): GetUserReply;
}

export namespace GetUserReply {
  export type AsObject = {
    user?: domain_pb.User.AsObject,
    error?: GetUserReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): GetUserReply.Error.Status;
    setStatus(value: GetUserReply.Error.Status): Error;

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
      status: GetUserReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    USER = 1,
    ERROR = 2,
  }
}

export class GetUserRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserRequest): GetUserRequest.AsObject;
  static serializeBinaryToWriter(message: GetUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserRequest;
  static deserializeBinaryFromReader(message: GetUserRequest, reader: jspb.BinaryReader): GetUserRequest;
}

export namespace GetUserRequest {
  export type AsObject = {
    userId: string,
  }
}

