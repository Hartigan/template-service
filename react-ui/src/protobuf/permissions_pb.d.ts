import * as jspb from 'google-protobuf'

import * as domain_pb from './domain_pb';


export class RemoveMembersReply extends jspb.Message {
  getUsersList(): Array<RemoveMembersReply.UserEntry>;
  setUsersList(value: Array<RemoveMembersReply.UserEntry>): RemoveMembersReply;
  clearUsersList(): RemoveMembersReply;
  addUsers(value?: RemoveMembersReply.UserEntry, index?: number): RemoveMembersReply.UserEntry;

  getGroupsList(): Array<RemoveMembersReply.GroupEntry>;
  setGroupsList(value: Array<RemoveMembersReply.GroupEntry>): RemoveMembersReply;
  clearGroupsList(): RemoveMembersReply;
  addGroups(value?: RemoveMembersReply.GroupEntry, index?: number): RemoveMembersReply.GroupEntry;

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
    groupsList: Array<RemoveMembersReply.GroupEntry.AsObject>,
  }

  export class GroupEntry extends jspb.Message {
    getGroupId(): string;
    setGroupId(value: string): GroupEntry;

    getStatus(): RemoveMembersReply.Status;
    setStatus(value: RemoveMembersReply.Status): GroupEntry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GroupEntry.AsObject;
    static toObject(includeInstance: boolean, msg: GroupEntry): GroupEntry.AsObject;
    static serializeBinaryToWriter(message: GroupEntry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GroupEntry;
    static deserializeBinaryFromReader(message: GroupEntry, reader: jspb.BinaryReader): GroupEntry;
  }

  export namespace GroupEntry {
    export type AsObject = {
      groupId: string,
      status: RemoveMembersReply.Status,
    }
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
    ITEM_NOT_FOUND = 3,
  }
}

export class RemoveMembersRequest extends jspb.Message {
  getProtecteditem(): domain_pb.ProtectedItem | undefined;
  setProtecteditem(value?: domain_pb.ProtectedItem): RemoveMembersRequest;
  hasProtecteditem(): boolean;
  clearProtecteditem(): RemoveMembersRequest;

  getUsersList(): Array<string>;
  setUsersList(value: Array<string>): RemoveMembersRequest;
  clearUsersList(): RemoveMembersRequest;
  addUsers(value: string, index?: number): RemoveMembersRequest;

  getGroupsList(): Array<string>;
  setGroupsList(value: Array<string>): RemoveMembersRequest;
  clearGroupsList(): RemoveMembersRequest;
  addGroups(value: string, index?: number): RemoveMembersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveMembersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveMembersRequest): RemoveMembersRequest.AsObject;
  static serializeBinaryToWriter(message: RemoveMembersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveMembersRequest;
  static deserializeBinaryFromReader(message: RemoveMembersRequest, reader: jspb.BinaryReader): RemoveMembersRequest;
}

export namespace RemoveMembersRequest {
  export type AsObject = {
    protecteditem?: domain_pb.ProtectedItem.AsObject,
    usersList: Array<string>,
    groupsList: Array<string>,
  }
}

export class AddMembersReply extends jspb.Message {
  getUsersList(): Array<AddMembersReply.UserEntry>;
  setUsersList(value: Array<AddMembersReply.UserEntry>): AddMembersReply;
  clearUsersList(): AddMembersReply;
  addUsers(value?: AddMembersReply.UserEntry, index?: number): AddMembersReply.UserEntry;

  getGroupsList(): Array<AddMembersReply.GroupEntry>;
  setGroupsList(value: Array<AddMembersReply.GroupEntry>): AddMembersReply;
  clearGroupsList(): AddMembersReply;
  addGroups(value?: AddMembersReply.GroupEntry, index?: number): AddMembersReply.GroupEntry;

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
    groupsList: Array<AddMembersReply.GroupEntry.AsObject>,
  }

  export class GroupEntry extends jspb.Message {
    getGroupId(): string;
    setGroupId(value: string): GroupEntry;

    getStatus(): AddMembersReply.Status;
    setStatus(value: AddMembersReply.Status): GroupEntry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GroupEntry.AsObject;
    static toObject(includeInstance: boolean, msg: GroupEntry): GroupEntry.AsObject;
    static serializeBinaryToWriter(message: GroupEntry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GroupEntry;
    static deserializeBinaryFromReader(message: GroupEntry, reader: jspb.BinaryReader): GroupEntry;
  }

  export namespace GroupEntry {
    export type AsObject = {
      groupId: string,
      status: AddMembersReply.Status,
    }
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
    ITEM_NOT_FOUND = 3,
  }
}

export class AddMembersRequest extends jspb.Message {
  getProtecteditem(): domain_pb.ProtectedItem | undefined;
  setProtecteditem(value?: domain_pb.ProtectedItem): AddMembersRequest;
  hasProtecteditem(): boolean;
  clearProtecteditem(): AddMembersRequest;

  getUsersList(): Array<string>;
  setUsersList(value: Array<string>): AddMembersRequest;
  clearUsersList(): AddMembersRequest;
  addUsers(value: string, index?: number): AddMembersRequest;

  getGroupsList(): Array<string>;
  setGroupsList(value: Array<string>): AddMembersRequest;
  clearGroupsList(): AddMembersRequest;
  addGroups(value: string, index?: number): AddMembersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddMembersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddMembersRequest): AddMembersRequest.AsObject;
  static serializeBinaryToWriter(message: AddMembersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddMembersRequest;
  static deserializeBinaryFromReader(message: AddMembersRequest, reader: jspb.BinaryReader): AddMembersRequest;
}

export namespace AddMembersRequest {
  export type AsObject = {
    protecteditem?: domain_pb.ProtectedItem.AsObject,
    usersList: Array<string>,
    groupsList: Array<string>,
  }
}

export class UpdatePermissionsReply extends jspb.Message {
  getUsersList(): Array<UpdatePermissionsReply.UserEntry>;
  setUsersList(value: Array<UpdatePermissionsReply.UserEntry>): UpdatePermissionsReply;
  clearUsersList(): UpdatePermissionsReply;
  addUsers(value?: UpdatePermissionsReply.UserEntry, index?: number): UpdatePermissionsReply.UserEntry;

  getGroupsList(): Array<UpdatePermissionsReply.GroupEntry>;
  setGroupsList(value: Array<UpdatePermissionsReply.GroupEntry>): UpdatePermissionsReply;
  clearGroupsList(): UpdatePermissionsReply;
  addGroups(value?: UpdatePermissionsReply.GroupEntry, index?: number): UpdatePermissionsReply.GroupEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdatePermissionsReply.AsObject;
  static toObject(includeInstance: boolean, msg: UpdatePermissionsReply): UpdatePermissionsReply.AsObject;
  static serializeBinaryToWriter(message: UpdatePermissionsReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdatePermissionsReply;
  static deserializeBinaryFromReader(message: UpdatePermissionsReply, reader: jspb.BinaryReader): UpdatePermissionsReply;
}

export namespace UpdatePermissionsReply {
  export type AsObject = {
    usersList: Array<UpdatePermissionsReply.UserEntry.AsObject>,
    groupsList: Array<UpdatePermissionsReply.GroupEntry.AsObject>,
  }

  export class GroupEntry extends jspb.Message {
    getGroupId(): string;
    setGroupId(value: string): GroupEntry;

    getStatus(): UpdatePermissionsReply.Status;
    setStatus(value: UpdatePermissionsReply.Status): GroupEntry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GroupEntry.AsObject;
    static toObject(includeInstance: boolean, msg: GroupEntry): GroupEntry.AsObject;
    static serializeBinaryToWriter(message: GroupEntry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GroupEntry;
    static deserializeBinaryFromReader(message: GroupEntry, reader: jspb.BinaryReader): GroupEntry;
  }

  export namespace GroupEntry {
    export type AsObject = {
      groupId: string,
      status: UpdatePermissionsReply.Status,
    }
  }


  export class UserEntry extends jspb.Message {
    getUserId(): string;
    setUserId(value: string): UserEntry;

    getStatus(): UpdatePermissionsReply.Status;
    setStatus(value: UpdatePermissionsReply.Status): UserEntry;

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
      status: UpdatePermissionsReply.Status,
    }
  }


  export enum Status { 
    OK = 0,
    UNKNOWN = 1,
    NO_ACCESS = 2,
    ITEM_NOT_FOUND = 3,
  }
}

export class UpdatePermissionsRequest extends jspb.Message {
  getProtecteditem(): domain_pb.ProtectedItem | undefined;
  setProtecteditem(value?: domain_pb.ProtectedItem): UpdatePermissionsRequest;
  hasProtecteditem(): boolean;
  clearProtecteditem(): UpdatePermissionsRequest;

  getUsersList(): Array<UpdatePermissionsRequest.UserEntry>;
  setUsersList(value: Array<UpdatePermissionsRequest.UserEntry>): UpdatePermissionsRequest;
  clearUsersList(): UpdatePermissionsRequest;
  addUsers(value?: UpdatePermissionsRequest.UserEntry, index?: number): UpdatePermissionsRequest.UserEntry;

  getGroupsList(): Array<UpdatePermissionsRequest.GroupEntry>;
  setGroupsList(value: Array<UpdatePermissionsRequest.GroupEntry>): UpdatePermissionsRequest;
  clearGroupsList(): UpdatePermissionsRequest;
  addGroups(value?: UpdatePermissionsRequest.GroupEntry, index?: number): UpdatePermissionsRequest.GroupEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdatePermissionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdatePermissionsRequest): UpdatePermissionsRequest.AsObject;
  static serializeBinaryToWriter(message: UpdatePermissionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdatePermissionsRequest;
  static deserializeBinaryFromReader(message: UpdatePermissionsRequest, reader: jspb.BinaryReader): UpdatePermissionsRequest;
}

export namespace UpdatePermissionsRequest {
  export type AsObject = {
    protecteditem?: domain_pb.ProtectedItem.AsObject,
    usersList: Array<UpdatePermissionsRequest.UserEntry.AsObject>,
    groupsList: Array<UpdatePermissionsRequest.GroupEntry.AsObject>,
  }

  export class GroupEntry extends jspb.Message {
    getGroupId(): string;
    setGroupId(value: string): GroupEntry;

    getAccess(): domain_pb.Access | undefined;
    setAccess(value?: domain_pb.Access): GroupEntry;
    hasAccess(): boolean;
    clearAccess(): GroupEntry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GroupEntry.AsObject;
    static toObject(includeInstance: boolean, msg: GroupEntry): GroupEntry.AsObject;
    static serializeBinaryToWriter(message: GroupEntry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GroupEntry;
    static deserializeBinaryFromReader(message: GroupEntry, reader: jspb.BinaryReader): GroupEntry;
  }

  export namespace GroupEntry {
    export type AsObject = {
      groupId: string,
      access?: domain_pb.Access.AsObject,
    }
  }


  export class UserEntry extends jspb.Message {
    getUserId(): string;
    setUserId(value: string): UserEntry;

    getAccess(): domain_pb.Access | undefined;
    setAccess(value?: domain_pb.Access): UserEntry;
    hasAccess(): boolean;
    clearAccess(): UserEntry;

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
      access?: domain_pb.Access.AsObject,
    }
  }

}

export class GetAccessInfoReply extends jspb.Message {
  getAccessMap(): jspb.Map<string, domain_pb.Access>;
  clearAccessMap(): GetAccessInfoReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccessInfoReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccessInfoReply): GetAccessInfoReply.AsObject;
  static serializeBinaryToWriter(message: GetAccessInfoReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccessInfoReply;
  static deserializeBinaryFromReader(message: GetAccessInfoReply, reader: jspb.BinaryReader): GetAccessInfoReply;
}

export namespace GetAccessInfoReply {
  export type AsObject = {
    accessMap: Array<[string, domain_pb.Access.AsObject]>,
  }
}

export class GetAccessInfoRequest extends jspb.Message {
  getProtecteditemsList(): Array<domain_pb.ProtectedItem>;
  setProtecteditemsList(value: Array<domain_pb.ProtectedItem>): GetAccessInfoRequest;
  clearProtecteditemsList(): GetAccessInfoRequest;
  addProtecteditems(value?: domain_pb.ProtectedItem, index?: number): domain_pb.ProtectedItem;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccessInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccessInfoRequest): GetAccessInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetAccessInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccessInfoRequest;
  static deserializeBinaryFromReader(message: GetAccessInfoRequest, reader: jspb.BinaryReader): GetAccessInfoRequest;
}

export namespace GetAccessInfoRequest {
  export type AsObject = {
    protecteditemsList: Array<domain_pb.ProtectedItem.AsObject>,
  }
}

export class SetIsPublicReply extends jspb.Message {
  getError(): SetIsPublicReply.Error | undefined;
  setError(value?: SetIsPublicReply.Error): SetIsPublicReply;
  hasError(): boolean;
  clearError(): SetIsPublicReply;

  getResultCase(): SetIsPublicReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetIsPublicReply.AsObject;
  static toObject(includeInstance: boolean, msg: SetIsPublicReply): SetIsPublicReply.AsObject;
  static serializeBinaryToWriter(message: SetIsPublicReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetIsPublicReply;
  static deserializeBinaryFromReader(message: SetIsPublicReply, reader: jspb.BinaryReader): SetIsPublicReply;
}

export namespace SetIsPublicReply {
  export type AsObject = {
    error?: SetIsPublicReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): SetIsPublicReply.Error.Status;
    setStatus(value: SetIsPublicReply.Error.Status): Error;

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
      status: SetIsPublicReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
      NO_ACCESS = 1,
      WRONG_REQUEST = 2,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    ERROR = 1,
  }
}

export class SetIsPublicRequest extends jspb.Message {
  getIsPublic(): boolean;
  setIsPublic(value: boolean): SetIsPublicRequest;

  getProtecteditem(): domain_pb.ProtectedItem | undefined;
  setProtecteditem(value?: domain_pb.ProtectedItem): SetIsPublicRequest;
  hasProtecteditem(): boolean;
  clearProtecteditem(): SetIsPublicRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetIsPublicRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetIsPublicRequest): SetIsPublicRequest.AsObject;
  static serializeBinaryToWriter(message: SetIsPublicRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetIsPublicRequest;
  static deserializeBinaryFromReader(message: SetIsPublicRequest, reader: jspb.BinaryReader): SetIsPublicRequest;
}

export namespace SetIsPublicRequest {
  export type AsObject = {
    isPublic: boolean,
    protecteditem?: domain_pb.ProtectedItem.AsObject,
  }
}

export class GetPermissionsReply extends jspb.Message {
  getPermissions(): domain_pb.Permissions | undefined;
  setPermissions(value?: domain_pb.Permissions): GetPermissionsReply;
  hasPermissions(): boolean;
  clearPermissions(): GetPermissionsReply;

  getError(): GetPermissionsReply.Error | undefined;
  setError(value?: GetPermissionsReply.Error): GetPermissionsReply;
  hasError(): boolean;
  clearError(): GetPermissionsReply;

  getResultCase(): GetPermissionsReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPermissionsReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetPermissionsReply): GetPermissionsReply.AsObject;
  static serializeBinaryToWriter(message: GetPermissionsReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPermissionsReply;
  static deserializeBinaryFromReader(message: GetPermissionsReply, reader: jspb.BinaryReader): GetPermissionsReply;
}

export namespace GetPermissionsReply {
  export type AsObject = {
    permissions?: domain_pb.Permissions.AsObject,
    error?: GetPermissionsReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): GetPermissionsReply.Error.Status;
    setStatus(value: GetPermissionsReply.Error.Status): Error;

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
      status: GetPermissionsReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
      NO_ACCESS = 1,
      WRONG_REQUEST = 2,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    PERMISSIONS = 1,
    ERROR = 2,
  }
}

export class GetPermissionsRequest extends jspb.Message {
  getItem(): domain_pb.ProtectedItem | undefined;
  setItem(value?: domain_pb.ProtectedItem): GetPermissionsRequest;
  hasItem(): boolean;
  clearItem(): GetPermissionsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPermissionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPermissionsRequest): GetPermissionsRequest.AsObject;
  static serializeBinaryToWriter(message: GetPermissionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPermissionsRequest;
  static deserializeBinaryFromReader(message: GetPermissionsRequest, reader: jspb.BinaryReader): GetPermissionsRequest;
}

export namespace GetPermissionsRequest {
  export type AsObject = {
    item?: domain_pb.ProtectedItem.AsObject,
  }
}

