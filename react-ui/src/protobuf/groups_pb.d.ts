import * as jspb from 'google-protobuf'

import * as domain_pb from './domain_pb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';


export class SearchReply extends jspb.Message {
  getGroups(): SearchReply.GroupList | undefined;
  setGroups(value?: SearchReply.GroupList): SearchReply;
  hasGroups(): boolean;
  clearGroups(): SearchReply;

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
    groups?: SearchReply.GroupList.AsObject,
    error?: SearchReply.Error.AsObject,
  }

  export class GroupList extends jspb.Message {
    getGroupsList(): Array<domain_pb.Group>;
    setGroupsList(value: Array<domain_pb.Group>): GroupList;
    clearGroupsList(): GroupList;
    addGroups(value?: domain_pb.Group, index?: number): domain_pb.Group;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GroupList.AsObject;
    static toObject(includeInstance: boolean, msg: GroupList): GroupList.AsObject;
    static serializeBinaryToWriter(message: GroupList, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GroupList;
    static deserializeBinaryFromReader(message: GroupList, reader: jspb.BinaryReader): GroupList;
  }

  export namespace GroupList {
    export type AsObject = {
      groupsList: Array<domain_pb.Group.AsObject>,
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
      NO_ACCESS = 1,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    GROUPS = 1,
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

export class AddMembersReply extends jspb.Message {
  getUsersList(): Array<AddMembersReply.UserEntry>;
  setUsersList(value: Array<AddMembersReply.UserEntry>): AddMembersReply;
  clearUsersList(): AddMembersReply;
  addUsers(value?: AddMembersReply.UserEntry, index?: number): AddMembersReply.UserEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddMembersReply.AsObject;
  static toObject(includeInstance: boolean, msg: AddMembersReply): AddMembersReply.AsObject;
  static serializeBinaryToWriter(message: AddMembersReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddMembersReply;
  static deserializeBinaryFromReader(message: AddMembersReply, reader: jspb.BinaryReader): AddMembersReply;
}

export namespace AddMembersReply {
  export type AsObject = {
    usersList: Array<AddMembersReply.UserEntry.AsObject>,
  }

  export class UserEntry extends jspb.Message {
    getUserId(): string;
    setUserId(value: string): UserEntry;

    getStatus(): AddMembersReply.Status;
    setStatus(value: AddMembersReply.Status): UserEntry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UserEntry.AsObject;
    static toObject(includeInstance: boolean, msg: UserEntry): UserEntry.AsObject;
    static serializeBinaryToWriter(message: UserEntry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UserEntry;
    static deserializeBinaryFromReader(message: UserEntry, reader: jspb.BinaryReader): UserEntry;
  }

  export namespace UserEntry {
    export type AsObject = {
      userId: string,
      status: AddMembersReply.Status,
    }
  }


  export enum Status { 
    OK = 0,
    UNKNOWN = 1,
    NO_ACCESS = 2,
  }
}

export class AddMembersRequest extends jspb.Message {
  getGroupId(): string;
  setGroupId(value: string): AddMembersRequest;

  getUsersList(): Array<string>;
  setUsersList(value: Array<string>): AddMembersRequest;
  clearUsersList(): AddMembersRequest;
  addUsers(value: string, index?: number): AddMembersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddMembersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddMembersRequest): AddMembersRequest.AsObject;
  static serializeBinaryToWriter(message: AddMembersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddMembersRequest;
  static deserializeBinaryFromReader(message: AddMembersRequest, reader: jspb.BinaryReader): AddMembersRequest;
}

export namespace AddMembersRequest {
  export type AsObject = {
    groupId: string,
    usersList: Array<string>,
  }
}

export class RemoveMembersReply extends jspb.Message {
  getUsersList(): Array<RemoveMembersReply.UserEntry>;
  setUsersList(value: Array<RemoveMembersReply.UserEntry>): RemoveMembersReply;
  clearUsersList(): RemoveMembersReply;
  addUsers(value?: RemoveMembersReply.UserEntry, index?: number): RemoveMembersReply.UserEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveMembersReply.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveMembersReply): RemoveMembersReply.AsObject;
  static serializeBinaryToWriter(message: RemoveMembersReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveMembersReply;
  static deserializeBinaryFromReader(message: RemoveMembersReply, reader: jspb.BinaryReader): RemoveMembersReply;
}

export namespace RemoveMembersReply {
  export type AsObject = {
    usersList: Array<RemoveMembersReply.UserEntry.AsObject>,
  }

  export class UserEntry extends jspb.Message {
    getUserId(): string;
    setUserId(value: string): UserEntry;

    getStatus(): RemoveMembersReply.Status;
    setStatus(value: RemoveMembersReply.Status): UserEntry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UserEntry.AsObject;
    static toObject(includeInstance: boolean, msg: UserEntry): UserEntry.AsObject;
    static serializeBinaryToWriter(message: UserEntry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UserEntry;
    static deserializeBinaryFromReader(message: UserEntry, reader: jspb.BinaryReader): UserEntry;
  }

  export namespace UserEntry {
    export type AsObject = {
      userId: string,
      status: RemoveMembersReply.Status,
    }
  }


  export enum Status { 
    OK = 0,
    UNKNOWN = 1,
    NO_ACCESS = 2,
  }
}

export class RemoveMembersRequest extends jspb.Message {
  getGroupId(): string;
  setGroupId(value: string): RemoveMembersRequest;

  getUsersList(): Array<string>;
  setUsersList(value: Array<string>): RemoveMembersRequest;
  clearUsersList(): RemoveMembersRequest;
  addUsers(value: string, index?: number): RemoveMembersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveMembersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveMembersRequest): RemoveMembersRequest.AsObject;
  static serializeBinaryToWriter(message: RemoveMembersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveMembersRequest;
  static deserializeBinaryFromReader(message: RemoveMembersRequest, reader: jspb.BinaryReader): RemoveMembersRequest;
}

export namespace RemoveMembersRequest {
  export type AsObject = {
    groupId: string,
    usersList: Array<string>,
  }
}

export class UpdateMemberReply extends jspb.Message {
  getError(): UpdateMemberReply.Error | undefined;
  setError(value?: UpdateMemberReply.Error): UpdateMemberReply;
  hasError(): boolean;
  clearError(): UpdateMemberReply;

  getResultCase(): UpdateMemberReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateMemberReply.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateMemberReply): UpdateMemberReply.AsObject;
  static serializeBinaryToWriter(message: UpdateMemberReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateMemberReply;
  static deserializeBinaryFromReader(message: UpdateMemberReply, reader: jspb.BinaryReader): UpdateMemberReply;
}

export namespace UpdateMemberReply {
  export type AsObject = {
    error?: UpdateMemberReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): UpdateMemberReply.Error.Status;
    setStatus(value: UpdateMemberReply.Error.Status): Error;

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
      status: UpdateMemberReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
      NO_ACCESS = 1,
      NOT_FOUND = 2,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    ERROR = 1,
  }
}

export class UpdateMemberRequest extends jspb.Message {
  getGroupId(): string;
  setGroupId(value: string): UpdateMemberRequest;

  getUserId(): string;
  setUserId(value: string): UpdateMemberRequest;

  getAccess(): domain_pb.Access | undefined;
  setAccess(value?: domain_pb.Access): UpdateMemberRequest;
  hasAccess(): boolean;
  clearAccess(): UpdateMemberRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateMemberRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateMemberRequest): UpdateMemberRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateMemberRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateMemberRequest;
  static deserializeBinaryFromReader(message: UpdateMemberRequest, reader: jspb.BinaryReader): UpdateMemberRequest;
}

export namespace UpdateMemberRequest {
  export type AsObject = {
    groupId: string,
    userId: string,
    access?: domain_pb.Access.AsObject,
  }
}

export class UpdateGroupReply extends jspb.Message {
  getOk(): google_protobuf_empty_pb.Empty | undefined;
  setOk(value?: google_protobuf_empty_pb.Empty): UpdateGroupReply;
  hasOk(): boolean;
  clearOk(): UpdateGroupReply;

  getError(): UpdateGroupReply.Error | undefined;
  setError(value?: UpdateGroupReply.Error): UpdateGroupReply;
  hasError(): boolean;
  clearError(): UpdateGroupReply;

  getResultCase(): UpdateGroupReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateGroupReply.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateGroupReply): UpdateGroupReply.AsObject;
  static serializeBinaryToWriter(message: UpdateGroupReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateGroupReply;
  static deserializeBinaryFromReader(message: UpdateGroupReply, reader: jspb.BinaryReader): UpdateGroupReply;
}

export namespace UpdateGroupReply {
  export type AsObject = {
    ok?: google_protobuf_empty_pb.Empty.AsObject,
    error?: UpdateGroupReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): UpdateGroupReply.Error.Status;
    setStatus(value: UpdateGroupReply.Error.Status): Error;

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
      status: UpdateGroupReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
      NO_ACCESS = 1,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    OK = 1,
    ERROR = 2,
  }
}

export class UpdateGroupRequest extends jspb.Message {
  getGroupId(): string;
  setGroupId(value: string): UpdateGroupRequest;

  getName(): google_protobuf_wrappers_pb.StringValue | undefined;
  setName(value?: google_protobuf_wrappers_pb.StringValue): UpdateGroupRequest;
  hasName(): boolean;
  clearName(): UpdateGroupRequest;

  getDescription(): google_protobuf_wrappers_pb.StringValue | undefined;
  setDescription(value?: google_protobuf_wrappers_pb.StringValue): UpdateGroupRequest;
  hasDescription(): boolean;
  clearDescription(): UpdateGroupRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateGroupRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateGroupRequest): UpdateGroupRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateGroupRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateGroupRequest;
  static deserializeBinaryFromReader(message: UpdateGroupRequest, reader: jspb.BinaryReader): UpdateGroupRequest;
}

export namespace UpdateGroupRequest {
  export type AsObject = {
    groupId: string,
    name?: google_protobuf_wrappers_pb.StringValue.AsObject,
    description?: google_protobuf_wrappers_pb.StringValue.AsObject,
  }
}

export class GetGroupsReply extends jspb.Message {
  getGroups(): GetGroupsReply.GroupList | undefined;
  setGroups(value?: GetGroupsReply.GroupList): GetGroupsReply;
  hasGroups(): boolean;
  clearGroups(): GetGroupsReply;

  getError(): GetGroupsReply.Error | undefined;
  setError(value?: GetGroupsReply.Error): GetGroupsReply;
  hasError(): boolean;
  clearError(): GetGroupsReply;

  getResultCase(): GetGroupsReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetGroupsReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetGroupsReply): GetGroupsReply.AsObject;
  static serializeBinaryToWriter(message: GetGroupsReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetGroupsReply;
  static deserializeBinaryFromReader(message: GetGroupsReply, reader: jspb.BinaryReader): GetGroupsReply;
}

export namespace GetGroupsReply {
  export type AsObject = {
    groups?: GetGroupsReply.GroupList.AsObject,
    error?: GetGroupsReply.Error.AsObject,
  }

  export class GroupList extends jspb.Message {
    getGroupsList(): Array<domain_pb.Group>;
    setGroupsList(value: Array<domain_pb.Group>): GroupList;
    clearGroupsList(): GroupList;
    addGroups(value?: domain_pb.Group, index?: number): domain_pb.Group;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GroupList.AsObject;
    static toObject(includeInstance: boolean, msg: GroupList): GroupList.AsObject;
    static serializeBinaryToWriter(message: GroupList, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GroupList;
    static deserializeBinaryFromReader(message: GroupList, reader: jspb.BinaryReader): GroupList;
  }

  export namespace GroupList {
    export type AsObject = {
      groupsList: Array<domain_pb.Group.AsObject>,
    }
  }


  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): GetGroupsReply.Error.Status;
    setStatus(value: GetGroupsReply.Error.Status): Error;

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
      status: GetGroupsReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
      NO_ACCESS = 1,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    GROUPS = 1,
    ERROR = 2,
  }
}

export class GetGroupsRequest extends jspb.Message {
  getGenerate(): boolean;
  setGenerate(value: boolean): GetGroupsRequest;

  getRead(): boolean;
  setRead(value: boolean): GetGroupsRequest;

  getWrite(): boolean;
  setWrite(value: boolean): GetGroupsRequest;

  getAdmin(): boolean;
  setAdmin(value: boolean): GetGroupsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetGroupsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetGroupsRequest): GetGroupsRequest.AsObject;
  static serializeBinaryToWriter(message: GetGroupsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetGroupsRequest;
  static deserializeBinaryFromReader(message: GetGroupsRequest, reader: jspb.BinaryReader): GetGroupsRequest;
}

export namespace GetGroupsRequest {
  export type AsObject = {
    generate: boolean,
    read: boolean,
    write: boolean,
    admin: boolean,
  }
}

export class GetGroupReply extends jspb.Message {
  getGroup(): domain_pb.Group | undefined;
  setGroup(value?: domain_pb.Group): GetGroupReply;
  hasGroup(): boolean;
  clearGroup(): GetGroupReply;

  getError(): GetGroupReply.Error | undefined;
  setError(value?: GetGroupReply.Error): GetGroupReply;
  hasError(): boolean;
  clearError(): GetGroupReply;

  getResultCase(): GetGroupReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetGroupReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetGroupReply): GetGroupReply.AsObject;
  static serializeBinaryToWriter(message: GetGroupReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetGroupReply;
  static deserializeBinaryFromReader(message: GetGroupReply, reader: jspb.BinaryReader): GetGroupReply;
}

export namespace GetGroupReply {
  export type AsObject = {
    group?: domain_pb.Group.AsObject,
    error?: GetGroupReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): GetGroupReply.Error.Status;
    setStatus(value: GetGroupReply.Error.Status): Error;

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
      status: GetGroupReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
      NO_ACCESS = 1,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    GROUP = 1,
    ERROR = 2,
  }
}

export class GetGroupRequest extends jspb.Message {
  getGroupId(): string;
  setGroupId(value: string): GetGroupRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetGroupRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetGroupRequest): GetGroupRequest.AsObject;
  static serializeBinaryToWriter(message: GetGroupRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetGroupRequest;
  static deserializeBinaryFromReader(message: GetGroupRequest, reader: jspb.BinaryReader): GetGroupRequest;
}

export namespace GetGroupRequest {
  export type AsObject = {
    groupId: string,
  }
}

export class CreateGroupReply extends jspb.Message {
  getGroupId(): string;
  setGroupId(value: string): CreateGroupReply;

  getError(): CreateGroupReply.Error | undefined;
  setError(value?: CreateGroupReply.Error): CreateGroupReply;
  hasError(): boolean;
  clearError(): CreateGroupReply;

  getResultCase(): CreateGroupReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateGroupReply.AsObject;
  static toObject(includeInstance: boolean, msg: CreateGroupReply): CreateGroupReply.AsObject;
  static serializeBinaryToWriter(message: CreateGroupReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateGroupReply;
  static deserializeBinaryFromReader(message: CreateGroupReply, reader: jspb.BinaryReader): CreateGroupReply;
}

export namespace CreateGroupReply {
  export type AsObject = {
    groupId: string,
    error?: CreateGroupReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): CreateGroupReply.Error.Status;
    setStatus(value: CreateGroupReply.Error.Status): Error;

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
      status: CreateGroupReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    GROUP_ID = 1,
    ERROR = 2,
  }
}

export class CreateGroupRequest extends jspb.Message {
  getName(): string;
  setName(value: string): CreateGroupRequest;

  getDescription(): string;
  setDescription(value: string): CreateGroupRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateGroupRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateGroupRequest): CreateGroupRequest.AsObject;
  static serializeBinaryToWriter(message: CreateGroupRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateGroupRequest;
  static deserializeBinaryFromReader(message: CreateGroupRequest, reader: jspb.BinaryReader): CreateGroupRequest;
}

export namespace CreateGroupRequest {
  export type AsObject = {
    name: string,
    description: string,
  }
}

