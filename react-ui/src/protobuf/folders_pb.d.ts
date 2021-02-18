import * as jspb from 'google-protobuf'

import * as domain_pb from './domain_pb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';


export class RenameReply extends jspb.Message {
  getOk(): google_protobuf_empty_pb.Empty | undefined;
  setOk(value?: google_protobuf_empty_pb.Empty): RenameReply;
  hasOk(): boolean;
  clearOk(): RenameReply;

  getError(): RenameReply.Error | undefined;
  setError(value?: RenameReply.Error): RenameReply;
  hasError(): boolean;
  clearError(): RenameReply;

  getResultCase(): RenameReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RenameReply.AsObject;
  static toObject(includeInstance: boolean, msg: RenameReply): RenameReply.AsObject;
  static serializeBinaryToWriter(message: RenameReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RenameReply;
  static deserializeBinaryFromReader(message: RenameReply, reader: jspb.BinaryReader): RenameReply;
}

export namespace RenameReply {
  export type AsObject = {
    ok?: google_protobuf_empty_pb.Empty.AsObject,
    error?: RenameReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): RenameReply.Error.Status;
    setStatus(value: RenameReply.Error.Status): Error;

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
      status: RenameReply.Error.Status,
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

export class RenameRequest extends jspb.Message {
  getParentId(): string;
  setParentId(value: string): RenameRequest;

  getName(): string;
  setName(value: string): RenameRequest;

  getHeadId(): string;
  setHeadId(value: string): RenameRequest;

  getFolderId(): string;
  setFolderId(value: string): RenameRequest;

  getTargetCase(): RenameRequest.TargetCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RenameRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RenameRequest): RenameRequest.AsObject;
  static serializeBinaryToWriter(message: RenameRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RenameRequest;
  static deserializeBinaryFromReader(message: RenameRequest, reader: jspb.BinaryReader): RenameRequest;
}

export namespace RenameRequest {
  export type AsObject = {
    parentId: string,
    name: string,
    headId: string,
    folderId: string,
  }

  export enum TargetCase { 
    TARGET_NOT_SET = 0,
    HEAD_ID = 3,
    FOLDER_ID = 4,
  }
}

export class MoveReply extends jspb.Message {
  getError(): MoveReply.Error | undefined;
  setError(value?: MoveReply.Error): MoveReply;
  hasError(): boolean;
  clearError(): MoveReply;

  getResultCase(): MoveReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MoveReply.AsObject;
  static toObject(includeInstance: boolean, msg: MoveReply): MoveReply.AsObject;
  static serializeBinaryToWriter(message: MoveReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MoveReply;
  static deserializeBinaryFromReader(message: MoveReply, reader: jspb.BinaryReader): MoveReply;
}

export namespace MoveReply {
  export type AsObject = {
    error?: MoveReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): MoveReply.Error.Status;
    setStatus(value: MoveReply.Error.Status): Error;

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
      status: MoveReply.Error.Status,
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

export class MoveRequest extends jspb.Message {
  getSourceId(): string;
  setSourceId(value: string): MoveRequest;

  getDestinationId(): string;
  setDestinationId(value: string): MoveRequest;

  getHeadId(): string;
  setHeadId(value: string): MoveRequest;

  getFolderId(): string;
  setFolderId(value: string): MoveRequest;

  getTargetCase(): MoveRequest.TargetCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MoveRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MoveRequest): MoveRequest.AsObject;
  static serializeBinaryToWriter(message: MoveRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MoveRequest;
  static deserializeBinaryFromReader(message: MoveRequest, reader: jspb.BinaryReader): MoveRequest;
}

export namespace MoveRequest {
  export type AsObject = {
    sourceId: string,
    destinationId: string,
    headId: string,
    folderId: string,
  }

  export enum TargetCase { 
    TARGET_NOT_SET = 0,
    HEAD_ID = 3,
    FOLDER_ID = 4,
  }
}

export class RestoreFromTrashRequest extends jspb.Message {
  getHeadsList(): Array<string>;
  setHeadsList(value: Array<string>): RestoreFromTrashRequest;
  clearHeadsList(): RestoreFromTrashRequest;
  addHeads(value: string, index?: number): RestoreFromTrashRequest;

  getFoldersList(): Array<string>;
  setFoldersList(value: Array<string>): RestoreFromTrashRequest;
  clearFoldersList(): RestoreFromTrashRequest;
  addFolders(value: string, index?: number): RestoreFromTrashRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RestoreFromTrashRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RestoreFromTrashRequest): RestoreFromTrashRequest.AsObject;
  static serializeBinaryToWriter(message: RestoreFromTrashRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RestoreFromTrashRequest;
  static deserializeBinaryFromReader(message: RestoreFromTrashRequest, reader: jspb.BinaryReader): RestoreFromTrashRequest;
}

export namespace RestoreFromTrashRequest {
  export type AsObject = {
    headsList: Array<string>,
    foldersList: Array<string>,
  }
}

export class RestoreFromTrashReply extends jspb.Message {
  getHeadsList(): Array<RestoreFromTrashReply.HeadEntry>;
  setHeadsList(value: Array<RestoreFromTrashReply.HeadEntry>): RestoreFromTrashReply;
  clearHeadsList(): RestoreFromTrashReply;
  addHeads(value?: RestoreFromTrashReply.HeadEntry, index?: number): RestoreFromTrashReply.HeadEntry;

  getFoldersList(): Array<RestoreFromTrashReply.FolderEntry>;
  setFoldersList(value: Array<RestoreFromTrashReply.FolderEntry>): RestoreFromTrashReply;
  clearFoldersList(): RestoreFromTrashReply;
  addFolders(value?: RestoreFromTrashReply.FolderEntry, index?: number): RestoreFromTrashReply.FolderEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RestoreFromTrashReply.AsObject;
  static toObject(includeInstance: boolean, msg: RestoreFromTrashReply): RestoreFromTrashReply.AsObject;
  static serializeBinaryToWriter(message: RestoreFromTrashReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RestoreFromTrashReply;
  static deserializeBinaryFromReader(message: RestoreFromTrashReply, reader: jspb.BinaryReader): RestoreFromTrashReply;
}

export namespace RestoreFromTrashReply {
  export type AsObject = {
    headsList: Array<RestoreFromTrashReply.HeadEntry.AsObject>,
    foldersList: Array<RestoreFromTrashReply.FolderEntry.AsObject>,
  }

  export class HeadEntry extends jspb.Message {
    getHeadId(): string;
    setHeadId(value: string): HeadEntry;

    getStatus(): RestoreFromTrashReply.Status;
    setStatus(value: RestoreFromTrashReply.Status): HeadEntry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HeadEntry.AsObject;
    static toObject(includeInstance: boolean, msg: HeadEntry): HeadEntry.AsObject;
    static serializeBinaryToWriter(message: HeadEntry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HeadEntry;
    static deserializeBinaryFromReader(message: HeadEntry, reader: jspb.BinaryReader): HeadEntry;
  }

  export namespace HeadEntry {
    export type AsObject = {
      headId: string,
      status: RestoreFromTrashReply.Status,
    }
  }


  export class FolderEntry extends jspb.Message {
    getFolderId(): string;
    setFolderId(value: string): FolderEntry;

    getStatus(): RestoreFromTrashReply.Status;
    setStatus(value: RestoreFromTrashReply.Status): FolderEntry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FolderEntry.AsObject;
    static toObject(includeInstance: boolean, msg: FolderEntry): FolderEntry.AsObject;
    static serializeBinaryToWriter(message: FolderEntry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FolderEntry;
    static deserializeBinaryFromReader(message: FolderEntry, reader: jspb.BinaryReader): FolderEntry;
  }

  export namespace FolderEntry {
    export type AsObject = {
      folderId: string,
      status: RestoreFromTrashReply.Status,
    }
  }


  export enum Status { 
    OK = 0,
    UNKNOWN = 1,
    NO_ACCESS = 2,
  }
}

export class MoveToTrashReply extends jspb.Message {
  getHeadsList(): Array<MoveToTrashReply.HeadEntry>;
  setHeadsList(value: Array<MoveToTrashReply.HeadEntry>): MoveToTrashReply;
  clearHeadsList(): MoveToTrashReply;
  addHeads(value?: MoveToTrashReply.HeadEntry, index?: number): MoveToTrashReply.HeadEntry;

  getFoldersList(): Array<MoveToTrashReply.FolderEntry>;
  setFoldersList(value: Array<MoveToTrashReply.FolderEntry>): MoveToTrashReply;
  clearFoldersList(): MoveToTrashReply;
  addFolders(value?: MoveToTrashReply.FolderEntry, index?: number): MoveToTrashReply.FolderEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MoveToTrashReply.AsObject;
  static toObject(includeInstance: boolean, msg: MoveToTrashReply): MoveToTrashReply.AsObject;
  static serializeBinaryToWriter(message: MoveToTrashReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MoveToTrashReply;
  static deserializeBinaryFromReader(message: MoveToTrashReply, reader: jspb.BinaryReader): MoveToTrashReply;
}

export namespace MoveToTrashReply {
  export type AsObject = {
    headsList: Array<MoveToTrashReply.HeadEntry.AsObject>,
    foldersList: Array<MoveToTrashReply.FolderEntry.AsObject>,
  }

  export class HeadEntry extends jspb.Message {
    getHeadId(): string;
    setHeadId(value: string): HeadEntry;

    getStatus(): MoveToTrashReply.Status;
    setStatus(value: MoveToTrashReply.Status): HeadEntry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HeadEntry.AsObject;
    static toObject(includeInstance: boolean, msg: HeadEntry): HeadEntry.AsObject;
    static serializeBinaryToWriter(message: HeadEntry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HeadEntry;
    static deserializeBinaryFromReader(message: HeadEntry, reader: jspb.BinaryReader): HeadEntry;
  }

  export namespace HeadEntry {
    export type AsObject = {
      headId: string,
      status: MoveToTrashReply.Status,
    }
  }


  export class FolderEntry extends jspb.Message {
    getFolderId(): string;
    setFolderId(value: string): FolderEntry;

    getStatus(): MoveToTrashReply.Status;
    setStatus(value: MoveToTrashReply.Status): FolderEntry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FolderEntry.AsObject;
    static toObject(includeInstance: boolean, msg: FolderEntry): FolderEntry.AsObject;
    static serializeBinaryToWriter(message: FolderEntry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FolderEntry;
    static deserializeBinaryFromReader(message: FolderEntry, reader: jspb.BinaryReader): FolderEntry;
  }

  export namespace FolderEntry {
    export type AsObject = {
      folderId: string,
      status: MoveToTrashReply.Status,
    }
  }


  export enum Status { 
    OK = 0,
    UNKNOWN = 1,
    NO_ACCESS = 2,
  }
}

export class MoveToTrashRequest extends jspb.Message {
  getHeadsList(): Array<MoveToTrashRequest.HeadEntry>;
  setHeadsList(value: Array<MoveToTrashRequest.HeadEntry>): MoveToTrashRequest;
  clearHeadsList(): MoveToTrashRequest;
  addHeads(value?: MoveToTrashRequest.HeadEntry, index?: number): MoveToTrashRequest.HeadEntry;

  getFoldersList(): Array<MoveToTrashRequest.FolderEntry>;
  setFoldersList(value: Array<MoveToTrashRequest.FolderEntry>): MoveToTrashRequest;
  clearFoldersList(): MoveToTrashRequest;
  addFolders(value?: MoveToTrashRequest.FolderEntry, index?: number): MoveToTrashRequest.FolderEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MoveToTrashRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MoveToTrashRequest): MoveToTrashRequest.AsObject;
  static serializeBinaryToWriter(message: MoveToTrashRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MoveToTrashRequest;
  static deserializeBinaryFromReader(message: MoveToTrashRequest, reader: jspb.BinaryReader): MoveToTrashRequest;
}

export namespace MoveToTrashRequest {
  export type AsObject = {
    headsList: Array<MoveToTrashRequest.HeadEntry.AsObject>,
    foldersList: Array<MoveToTrashRequest.FolderEntry.AsObject>,
  }

  export class HeadEntry extends jspb.Message {
    getParentId(): string;
    setParentId(value: string): HeadEntry;

    getHeadId(): string;
    setHeadId(value: string): HeadEntry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HeadEntry.AsObject;
    static toObject(includeInstance: boolean, msg: HeadEntry): HeadEntry.AsObject;
    static serializeBinaryToWriter(message: HeadEntry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HeadEntry;
    static deserializeBinaryFromReader(message: HeadEntry, reader: jspb.BinaryReader): HeadEntry;
  }

  export namespace HeadEntry {
    export type AsObject = {
      parentId: string,
      headId: string,
    }
  }


  export class FolderEntry extends jspb.Message {
    getParentId(): string;
    setParentId(value: string): FolderEntry;

    getFolderId(): string;
    setFolderId(value: string): FolderEntry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FolderEntry.AsObject;
    static toObject(includeInstance: boolean, msg: FolderEntry): FolderEntry.AsObject;
    static serializeBinaryToWriter(message: FolderEntry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FolderEntry;
    static deserializeBinaryFromReader(message: FolderEntry, reader: jspb.BinaryReader): FolderEntry;
  }

  export namespace FolderEntry {
    export type AsObject = {
      parentId: string,
      folderId: string,
    }
  }

}

export class GetTrashReply extends jspb.Message {
  getTrash(): domain_pb.Trash | undefined;
  setTrash(value?: domain_pb.Trash): GetTrashReply;
  hasTrash(): boolean;
  clearTrash(): GetTrashReply;

  getError(): GetTrashReply.Error | undefined;
  setError(value?: GetTrashReply.Error): GetTrashReply;
  hasError(): boolean;
  clearError(): GetTrashReply;

  getResultCase(): GetTrashReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTrashReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetTrashReply): GetTrashReply.AsObject;
  static serializeBinaryToWriter(message: GetTrashReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTrashReply;
  static deserializeBinaryFromReader(message: GetTrashReply, reader: jspb.BinaryReader): GetTrashReply;
}

export namespace GetTrashReply {
  export type AsObject = {
    trash?: domain_pb.Trash.AsObject,
    error?: GetTrashReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): GetTrashReply.Error.Status;
    setStatus(value: GetTrashReply.Error.Status): Error;

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
      status: GetTrashReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    TRASH = 1,
    ERROR = 2,
  }
}

export class GetTrashRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTrashRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTrashRequest): GetTrashRequest.AsObject;
  static serializeBinaryToWriter(message: GetTrashRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTrashRequest;
  static deserializeBinaryFromReader(message: GetTrashRequest, reader: jspb.BinaryReader): GetTrashRequest;
}

export namespace GetTrashRequest {
  export type AsObject = {
  }
}

export class GetRootReply extends jspb.Message {
  getFolder(): domain_pb.Folder | undefined;
  setFolder(value?: domain_pb.Folder): GetRootReply;
  hasFolder(): boolean;
  clearFolder(): GetRootReply;

  getError(): GetRootReply.Error | undefined;
  setError(value?: GetRootReply.Error): GetRootReply;
  hasError(): boolean;
  clearError(): GetRootReply;

  getResultCase(): GetRootReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRootReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetRootReply): GetRootReply.AsObject;
  static serializeBinaryToWriter(message: GetRootReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRootReply;
  static deserializeBinaryFromReader(message: GetRootReply, reader: jspb.BinaryReader): GetRootReply;
}

export namespace GetRootReply {
  export type AsObject = {
    folder?: domain_pb.Folder.AsObject,
    error?: GetRootReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): GetRootReply.Error.Status;
    setStatus(value: GetRootReply.Error.Status): Error;

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
      status: GetRootReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    FOLDER = 1,
    ERROR = 2,
  }
}

export class GetRootRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRootRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetRootRequest): GetRootRequest.AsObject;
  static serializeBinaryToWriter(message: GetRootRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRootRequest;
  static deserializeBinaryFromReader(message: GetRootRequest, reader: jspb.BinaryReader): GetRootRequest;
}

export namespace GetRootRequest {
  export type AsObject = {
  }
}

export class CreateFolderReply extends jspb.Message {
  getNewFolderId(): string;
  setNewFolderId(value: string): CreateFolderReply;

  getError(): CreateFolderReply.Error | undefined;
  setError(value?: CreateFolderReply.Error): CreateFolderReply;
  hasError(): boolean;
  clearError(): CreateFolderReply;

  getResultCase(): CreateFolderReply.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateFolderReply.AsObject;
  static toObject(includeInstance: boolean, msg: CreateFolderReply): CreateFolderReply.AsObject;
  static serializeBinaryToWriter(message: CreateFolderReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateFolderReply;
  static deserializeBinaryFromReader(message: CreateFolderReply, reader: jspb.BinaryReader): CreateFolderReply;
}

export namespace CreateFolderReply {
  export type AsObject = {
    newFolderId: string,
    error?: CreateFolderReply.Error.AsObject,
  }

  export class Error extends jspb.Message {
    getDescription(): string;
    setDescription(value: string): Error;

    getStatus(): CreateFolderReply.Error.Status;
    setStatus(value: CreateFolderReply.Error.Status): Error;

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
      status: CreateFolderReply.Error.Status,
    }

    export enum Status { 
      UNKNOWN = 0,
      NO_ACCESS = 1,
    }
  }


  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    NEW_FOLDER_ID = 1,
    ERROR = 2,
  }
}

export class CreateFolderRequest extends jspb.Message {
  getName(): string;
  setName(value: string): CreateFolderRequest;

  getDestinationId(): string;
  setDestinationId(value: string): CreateFolderRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateFolderRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateFolderRequest): CreateFolderRequest.AsObject;
  static serializeBinaryToWriter(message: CreateFolderRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateFolderRequest;
  static deserializeBinaryFromReader(message: CreateFolderRequest, reader: jspb.BinaryReader): CreateFolderRequest;
}

export namespace CreateFolderRequest {
  export type AsObject = {
    name: string,
    destinationId: string,
  }
}

export class GetFoldersReply extends jspb.Message {
  getEntriesList(): Array<GetFoldersReply.Entry>;
  setEntriesList(value: Array<GetFoldersReply.Entry>): GetFoldersReply;
  clearEntriesList(): GetFoldersReply;
  addEntries(value?: GetFoldersReply.Entry, index?: number): GetFoldersReply.Entry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFoldersReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetFoldersReply): GetFoldersReply.AsObject;
  static serializeBinaryToWriter(message: GetFoldersReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFoldersReply;
  static deserializeBinaryFromReader(message: GetFoldersReply, reader: jspb.BinaryReader): GetFoldersReply;
}

export namespace GetFoldersReply {
  export type AsObject = {
    entriesList: Array<GetFoldersReply.Entry.AsObject>,
  }

  export class Entry extends jspb.Message {
    getFolderId(): string;
    setFolderId(value: string): Entry;

    getStatus(): GetFoldersReply.Status;
    setStatus(value: GetFoldersReply.Status): Entry;

    getFolder(): domain_pb.Folder | undefined;
    setFolder(value?: domain_pb.Folder): Entry;
    hasFolder(): boolean;
    clearFolder(): Entry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Entry.AsObject;
    static toObject(includeInstance: boolean, msg: Entry): Entry.AsObject;
    static serializeBinaryToWriter(message: Entry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Entry;
    static deserializeBinaryFromReader(message: Entry, reader: jspb.BinaryReader): Entry;
  }

  export namespace Entry {
    export type AsObject = {
      folderId: string,
      status: GetFoldersReply.Status,
      folder?: domain_pb.Folder.AsObject,
    }
  }


  export enum Status { 
    OK = 0,
    UNKNOWN = 1,
    NO_ACCESS = 2,
  }
}

export class GetFoldersRequest extends jspb.Message {
  getFolderIdsList(): Array<string>;
  setFolderIdsList(value: Array<string>): GetFoldersRequest;
  clearFolderIdsList(): GetFoldersRequest;
  addFolderIds(value: string, index?: number): GetFoldersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFoldersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFoldersRequest): GetFoldersRequest.AsObject;
  static serializeBinaryToWriter(message: GetFoldersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFoldersRequest;
  static deserializeBinaryFromReader(message: GetFoldersRequest, reader: jspb.BinaryReader): GetFoldersRequest;
}

export namespace GetFoldersRequest {
  export type AsObject = {
    folderIdsList: Array<string>,
  }
}

