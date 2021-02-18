import * as jspb from 'google-protobuf'

import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';


export class ProblemSet extends jspb.Message {
  getId(): string;
  setId(value: string): ProblemSet;

  getTitle(): string;
  setTitle(value: string): ProblemSet;

  getDurationS(): number;
  setDurationS(value: number): ProblemSet;

  getSlotsList(): Array<ProblemSet.Slot>;
  setSlotsList(value: Array<ProblemSet.Slot>): ProblemSet;
  clearSlotsList(): ProblemSet;
  addSlots(value?: ProblemSet.Slot, index?: number): ProblemSet.Slot;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProblemSet.AsObject;
  static toObject(includeInstance: boolean, msg: ProblemSet): ProblemSet.AsObject;
  static serializeBinaryToWriter(message: ProblemSet, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProblemSet;
  static deserializeBinaryFromReader(message: ProblemSet, reader: jspb.BinaryReader): ProblemSet;
}

export namespace ProblemSet {
  export type AsObject = {
    id: string,
    title: string,
    durationS: number,
    slotsList: Array<ProblemSet.Slot.AsObject>,
  }

  export class Slot extends jspb.Message {
    getHeadIdsList(): Array<string>;
    setHeadIdsList(value: Array<string>): Slot;
    clearHeadIdsList(): Slot;
    addHeadIds(value: string, index?: number): Slot;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Slot.AsObject;
    static toObject(includeInstance: boolean, msg: Slot): Slot.AsObject;
    static serializeBinaryToWriter(message: Slot, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Slot;
    static deserializeBinaryFromReader(message: Slot, reader: jspb.BinaryReader): Slot;
  }

  export namespace Slot {
    export type AsObject = {
      headIdsList: Array<string>,
    }
  }

}

export class GeneratedProblem extends jspb.Message {
  getId(): string;
  setId(value: string): GeneratedProblem;

  getProblemId(): string;
  setProblemId(value: string): GeneratedProblem;

  getSeed(): number;
  setSeed(value: number): GeneratedProblem;

  getTitle(): string;
  setTitle(value: string): GeneratedProblem;

  getView(): GeneratedView | undefined;
  setView(value?: GeneratedView): GeneratedProblem;
  hasView(): boolean;
  clearView(): GeneratedProblem;

  getAnswer(): string;
  setAnswer(value: string): GeneratedProblem;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GeneratedProblem.AsObject;
  static toObject(includeInstance: boolean, msg: GeneratedProblem): GeneratedProblem.AsObject;
  static serializeBinaryToWriter(message: GeneratedProblem, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GeneratedProblem;
  static deserializeBinaryFromReader(message: GeneratedProblem, reader: jspb.BinaryReader): GeneratedProblem;
}

export namespace GeneratedProblem {
  export type AsObject = {
    id: string,
    problemId: string,
    seed: number,
    title: string,
    view?: GeneratedView.AsObject,
    answer: string,
  }
}

export class Problem extends jspb.Message {
  getId(): string;
  setId(value: string): Problem;

  getTitle(): string;
  setTitle(value: string): Problem;

  getView(): View | undefined;
  setView(value?: View): Problem;
  hasView(): boolean;
  clearView(): Problem;

  getController(): Controller | undefined;
  setController(value?: Controller): Problem;
  hasController(): boolean;
  clearController(): Problem;

  getValidator(): Validator | undefined;
  setValidator(value?: Validator): Problem;
  hasValidator(): boolean;
  clearValidator(): Problem;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Problem.AsObject;
  static toObject(includeInstance: boolean, msg: Problem): Problem.AsObject;
  static serializeBinaryToWriter(message: Problem, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Problem;
  static deserializeBinaryFromReader(message: Problem, reader: jspb.BinaryReader): Problem;
}

export namespace Problem {
  export type AsObject = {
    id: string,
    title: string,
    view?: View.AsObject,
    controller?: Controller.AsObject,
    validator?: Validator.AsObject,
  }
}

export class Validator extends jspb.Message {
  getLanguage(): Validator.Language;
  setLanguage(value: Validator.Language): Validator;

  getContent(): string;
  setContent(value: string): Validator;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Validator.AsObject;
  static toObject(includeInstance: boolean, msg: Validator): Validator.AsObject;
  static serializeBinaryToWriter(message: Validator, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Validator;
  static deserializeBinaryFromReader(message: Validator, reader: jspb.BinaryReader): Validator;
}

export namespace Validator {
  export type AsObject = {
    language: Validator.Language,
    content: string,
  }

  export enum Language { 
    C_SHARP = 0,
    INTEGER_VALIDATOR = 1,
    FLOAT_VALIDATOR = 2,
    STRING_VALIDATOR = 3,
  }
}

export class Controller extends jspb.Message {
  getLanguage(): Controller.Language;
  setLanguage(value: Controller.Language): Controller;

  getContent(): string;
  setContent(value: string): Controller;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Controller.AsObject;
  static toObject(includeInstance: boolean, msg: Controller): Controller.AsObject;
  static serializeBinaryToWriter(message: Controller, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Controller;
  static deserializeBinaryFromReader(message: Controller, reader: jspb.BinaryReader): Controller;
}

export namespace Controller {
  export type AsObject = {
    language: Controller.Language,
    content: string,
  }

  export enum Language { 
    C_SHARP = 0,
  }
}

export class View extends jspb.Message {
  getLanguage(): View.Language;
  setLanguage(value: View.Language): View;

  getContent(): string;
  setContent(value: string): View;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): View.AsObject;
  static toObject(includeInstance: boolean, msg: View): View.AsObject;
  static serializeBinaryToWriter(message: View, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): View;
  static deserializeBinaryFromReader(message: View, reader: jspb.BinaryReader): View;
}

export namespace View {
  export type AsObject = {
    language: View.Language,
    content: string,
  }

  export enum Language { 
    MARKDOWN = 0,
    PLAIN_TEXT = 1,
    TEX = 2,
  }
}

export class Permissions extends jspb.Message {
  getOwnerId(): string;
  setOwnerId(value: string): Permissions;

  getIsPublic(): boolean;
  setIsPublic(value: boolean): Permissions;

  getGroupsList(): Array<GroupAccess>;
  setGroupsList(value: Array<GroupAccess>): Permissions;
  clearGroupsList(): Permissions;
  addGroups(value?: GroupAccess, index?: number): GroupAccess;

  getMembersList(): Array<Member>;
  setMembersList(value: Array<Member>): Permissions;
  clearMembersList(): Permissions;
  addMembers(value?: Member, index?: number): Member;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Permissions.AsObject;
  static toObject(includeInstance: boolean, msg: Permissions): Permissions.AsObject;
  static serializeBinaryToWriter(message: Permissions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Permissions;
  static deserializeBinaryFromReader(message: Permissions, reader: jspb.BinaryReader): Permissions;
}

export namespace Permissions {
  export type AsObject = {
    ownerId: string,
    isPublic: boolean,
    groupsList: Array<GroupAccess.AsObject>,
    membersList: Array<Member.AsObject>,
  }
}

export class ProtectedItem extends jspb.Message {
  getId(): string;
  setId(value: string): ProtectedItem;

  getType(): ProtectedItem.ProtectedType;
  setType(value: ProtectedItem.ProtectedType): ProtectedItem;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProtectedItem.AsObject;
  static toObject(includeInstance: boolean, msg: ProtectedItem): ProtectedItem.AsObject;
  static serializeBinaryToWriter(message: ProtectedItem, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProtectedItem;
  static deserializeBinaryFromReader(message: ProtectedItem, reader: jspb.BinaryReader): ProtectedItem;
}

export namespace ProtectedItem {
  export type AsObject = {
    id: string,
    type: ProtectedItem.ProtectedType,
  }

  export enum ProtectedType { 
    FOLDER = 0,
    HEAD = 1,
    SUBMISSION = 2,
    REPORT = 3,
  }
}

export class Group extends jspb.Message {
  getId(): string;
  setId(value: string): Group;

  getOwnerId(): string;
  setOwnerId(value: string): Group;

  getName(): string;
  setName(value: string): Group;

  getDescription(): string;
  setDescription(value: string): Group;

  getMembersList(): Array<Member>;
  setMembersList(value: Array<Member>): Group;
  clearMembersList(): Group;
  addMembers(value?: Member, index?: number): Member;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Group.AsObject;
  static toObject(includeInstance: boolean, msg: Group): Group.AsObject;
  static serializeBinaryToWriter(message: Group, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Group;
  static deserializeBinaryFromReader(message: Group, reader: jspb.BinaryReader): Group;
}

export namespace Group {
  export type AsObject = {
    id: string,
    ownerId: string,
    name: string,
    description: string,
    membersList: Array<Member.AsObject>,
  }
}

export class GroupAccess extends jspb.Message {
  getGroupId(): string;
  setGroupId(value: string): GroupAccess;

  getName(): string;
  setName(value: string): GroupAccess;

  getAccess(): Access | undefined;
  setAccess(value?: Access): GroupAccess;
  hasAccess(): boolean;
  clearAccess(): GroupAccess;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupAccess.AsObject;
  static toObject(includeInstance: boolean, msg: GroupAccess): GroupAccess.AsObject;
  static serializeBinaryToWriter(message: GroupAccess, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupAccess;
  static deserializeBinaryFromReader(message: GroupAccess, reader: jspb.BinaryReader): GroupAccess;
}

export namespace GroupAccess {
  export type AsObject = {
    groupId: string,
    name: string,
    access?: Access.AsObject,
  }
}

export class Member extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): Member;

  getName(): string;
  setName(value: string): Member;

  getAccess(): Access | undefined;
  setAccess(value?: Access): Member;
  hasAccess(): boolean;
  clearAccess(): Member;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Member.AsObject;
  static toObject(includeInstance: boolean, msg: Member): Member.AsObject;
  static serializeBinaryToWriter(message: Member, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Member;
  static deserializeBinaryFromReader(message: Member, reader: jspb.BinaryReader): Member;
}

export namespace Member {
  export type AsObject = {
    userId: string,
    name: string,
    access?: Access.AsObject,
  }
}

export class Access extends jspb.Message {
  getGenerate(): boolean;
  setGenerate(value: boolean): Access;

  getRead(): boolean;
  setRead(value: boolean): Access;

  getWrite(): boolean;
  setWrite(value: boolean): Access;

  getAdmin(): boolean;
  setAdmin(value: boolean): Access;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Access.AsObject;
  static toObject(includeInstance: boolean, msg: Access): Access.AsObject;
  static serializeBinaryToWriter(message: Access, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Access;
  static deserializeBinaryFromReader(message: Access, reader: jspb.BinaryReader): Access;
}

export namespace Access {
  export type AsObject = {
    generate: boolean,
    read: boolean,
    write: boolean,
    admin: boolean,
  }
}

export class Trash extends jspb.Message {
  getHeadsList(): Array<TrashHeadEntry>;
  setHeadsList(value: Array<TrashHeadEntry>): Trash;
  clearHeadsList(): Trash;
  addHeads(value?: TrashHeadEntry, index?: number): TrashHeadEntry;

  getFoldersList(): Array<TrashFolderEntry>;
  setFoldersList(value: Array<TrashFolderEntry>): Trash;
  clearFoldersList(): Trash;
  addFolders(value?: TrashFolderEntry, index?: number): TrashFolderEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Trash.AsObject;
  static toObject(includeInstance: boolean, msg: Trash): Trash.AsObject;
  static serializeBinaryToWriter(message: Trash, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Trash;
  static deserializeBinaryFromReader(message: Trash, reader: jspb.BinaryReader): Trash;
}

export namespace Trash {
  export type AsObject = {
    headsList: Array<TrashHeadEntry.AsObject>,
    foldersList: Array<TrashFolderEntry.AsObject>,
  }
}

export class TrashHeadEntry extends jspb.Message {
  getHeadId(): string;
  setHeadId(value: string): TrashHeadEntry;

  getName(): string;
  setName(value: string): TrashHeadEntry;

  getType(): TargetModel.ModelType;
  setType(value: TargetModel.ModelType): TrashHeadEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrashHeadEntry.AsObject;
  static toObject(includeInstance: boolean, msg: TrashHeadEntry): TrashHeadEntry.AsObject;
  static serializeBinaryToWriter(message: TrashHeadEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrashHeadEntry;
  static deserializeBinaryFromReader(message: TrashHeadEntry, reader: jspb.BinaryReader): TrashHeadEntry;
}

export namespace TrashHeadEntry {
  export type AsObject = {
    headId: string,
    name: string,
    type: TargetModel.ModelType,
  }
}

export class TrashFolderEntry extends jspb.Message {
  getFolderId(): string;
  setFolderId(value: string): TrashFolderEntry;

  getName(): string;
  setName(value: string): TrashFolderEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrashFolderEntry.AsObject;
  static toObject(includeInstance: boolean, msg: TrashFolderEntry): TrashFolderEntry.AsObject;
  static serializeBinaryToWriter(message: TrashFolderEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrashFolderEntry;
  static deserializeBinaryFromReader(message: TrashFolderEntry, reader: jspb.BinaryReader): TrashFolderEntry;
}

export namespace TrashFolderEntry {
  export type AsObject = {
    folderId: string,
    name: string,
  }
}

export class Folder extends jspb.Message {
  getId(): string;
  setId(value: string): Folder;

  getName(): string;
  setName(value: string): Folder;

  getFoldersList(): Array<FolderLink>;
  setFoldersList(value: Array<FolderLink>): Folder;
  clearFoldersList(): Folder;
  addFolders(value?: FolderLink, index?: number): FolderLink;

  getHeadsList(): Array<HeadLink>;
  setHeadsList(value: Array<HeadLink>): Folder;
  clearHeadsList(): Folder;
  addHeads(value?: HeadLink, index?: number): HeadLink;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Folder.AsObject;
  static toObject(includeInstance: boolean, msg: Folder): Folder.AsObject;
  static serializeBinaryToWriter(message: Folder, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Folder;
  static deserializeBinaryFromReader(message: Folder, reader: jspb.BinaryReader): Folder;
}

export namespace Folder {
  export type AsObject = {
    id: string,
    name: string,
    foldersList: Array<FolderLink.AsObject>,
    headsList: Array<HeadLink.AsObject>,
  }
}

export class FolderLink extends jspb.Message {
  getId(): string;
  setId(value: string): FolderLink;

  getName(): string;
  setName(value: string): FolderLink;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FolderLink.AsObject;
  static toObject(includeInstance: boolean, msg: FolderLink): FolderLink.AsObject;
  static serializeBinaryToWriter(message: FolderLink, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FolderLink;
  static deserializeBinaryFromReader(message: FolderLink, reader: jspb.BinaryReader): FolderLink;
}

export namespace FolderLink {
  export type AsObject = {
    id: string,
    name: string,
  }
}

export class HeadLink extends jspb.Message {
  getId(): string;
  setId(value: string): HeadLink;

  getName(): string;
  setName(value: string): HeadLink;

  getType(): TargetModel.ModelType;
  setType(value: TargetModel.ModelType): HeadLink;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HeadLink.AsObject;
  static toObject(includeInstance: boolean, msg: HeadLink): HeadLink.AsObject;
  static serializeBinaryToWriter(message: HeadLink, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HeadLink;
  static deserializeBinaryFromReader(message: HeadLink, reader: jspb.BinaryReader): HeadLink;
}

export namespace HeadLink {
  export type AsObject = {
    id: string,
    name: string,
    type: TargetModel.ModelType,
  }
}

export class SubmissionPreview extends jspb.Message {
  getId(): string;
  setId(value: string): SubmissionPreview;

  getStartedAt(): number;
  setStartedAt(value: number): SubmissionPreview;

  getDeadline(): number;
  setDeadline(value: number): SubmissionPreview;

  getTitle(): string;
  setTitle(value: string): SubmissionPreview;

  getCompleted(): boolean;
  setCompleted(value: boolean): SubmissionPreview;

  getAuthor(): User | undefined;
  setAuthor(value?: User): SubmissionPreview;
  hasAuthor(): boolean;
  clearAuthor(): SubmissionPreview;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubmissionPreview.AsObject;
  static toObject(includeInstance: boolean, msg: SubmissionPreview): SubmissionPreview.AsObject;
  static serializeBinaryToWriter(message: SubmissionPreview, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubmissionPreview;
  static deserializeBinaryFromReader(message: SubmissionPreview, reader: jspb.BinaryReader): SubmissionPreview;
}

export namespace SubmissionPreview {
  export type AsObject = {
    id: string,
    startedAt: number,
    deadline: number,
    title: string,
    completed: boolean,
    author?: User.AsObject,
  }
}

export class ProblemSetPreview extends jspb.Message {
  getId(): string;
  setId(value: string): ProblemSetPreview;

  getTitle(): string;
  setTitle(value: string): ProblemSetPreview;

  getProblemsCount(): number;
  setProblemsCount(value: number): ProblemSetPreview;

  getDurationS(): number;
  setDurationS(value: number): ProblemSetPreview;

  getAuthor(): User | undefined;
  setAuthor(value?: User): ProblemSetPreview;
  hasAuthor(): boolean;
  clearAuthor(): ProblemSetPreview;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProblemSetPreview.AsObject;
  static toObject(includeInstance: boolean, msg: ProblemSetPreview): ProblemSetPreview.AsObject;
  static serializeBinaryToWriter(message: ProblemSetPreview, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProblemSetPreview;
  static deserializeBinaryFromReader(message: ProblemSetPreview, reader: jspb.BinaryReader): ProblemSetPreview;
}

export namespace ProblemSetPreview {
  export type AsObject = {
    id: string,
    title: string,
    problemsCount: number,
    durationS: number,
    author?: User.AsObject,
  }
}

export class Head extends jspb.Message {
  getId(): string;
  setId(value: string): Head;

  getName(): string;
  setName(value: string): Head;

  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): Head;
  clearTagsList(): Head;
  addTags(value: string, index?: number): Head;

  getCommit(): Commit | undefined;
  setCommit(value?: Commit): Head;
  hasCommit(): boolean;
  clearCommit(): Head;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Head.AsObject;
  static toObject(includeInstance: boolean, msg: Head): Head.AsObject;
  static serializeBinaryToWriter(message: Head, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Head;
  static deserializeBinaryFromReader(message: Head, reader: jspb.BinaryReader): Head;
}

export namespace Head {
  export type AsObject = {
    id: string,
    name: string,
    tagsList: Array<string>,
    commit?: Commit.AsObject,
  }
}

export class TargetModel extends jspb.Message {
  getId(): string;
  setId(value: string): TargetModel;

  getType(): TargetModel.ModelType;
  setType(value: TargetModel.ModelType): TargetModel;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TargetModel.AsObject;
  static toObject(includeInstance: boolean, msg: TargetModel): TargetModel.AsObject;
  static serializeBinaryToWriter(message: TargetModel, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TargetModel;
  static deserializeBinaryFromReader(message: TargetModel, reader: jspb.BinaryReader): TargetModel;
}

export namespace TargetModel {
  export type AsObject = {
    id: string,
    type: TargetModel.ModelType,
  }

  export enum ModelType { 
    PROBLEM = 0,
    PROBLEMSET = 1,
    UNKNOWN = 2,
  }
}

export class Commit extends jspb.Message {
  getId(): string;
  setId(value: string): Commit;

  getAuthorId(): string;
  setAuthorId(value: string): Commit;

  getHeadId(): string;
  setHeadId(value: string): Commit;

  getTimestamp(): number;
  setTimestamp(value: number): Commit;

  getTarget(): TargetModel | undefined;
  setTarget(value?: TargetModel): Commit;
  hasTarget(): boolean;
  clearTarget(): Commit;

  getDescription(): string;
  setDescription(value: string): Commit;

  getParentId(): string;
  setParentId(value: string): Commit;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Commit.AsObject;
  static toObject(includeInstance: boolean, msg: Commit): Commit.AsObject;
  static serializeBinaryToWriter(message: Commit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Commit;
  static deserializeBinaryFromReader(message: Commit, reader: jspb.BinaryReader): Commit;
}

export namespace Commit {
  export type AsObject = {
    id: string,
    authorId: string,
    headId: string,
    timestamp: number,
    target?: TargetModel.AsObject,
    description: string,
    parentId: string,
  }
}

export class UInt32Interval extends jspb.Message {
  getStart(): number;
  setStart(value: number): UInt32Interval;

  getEnd(): number;
  setEnd(value: number): UInt32Interval;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UInt32Interval.AsObject;
  static toObject(includeInstance: boolean, msg: UInt32Interval): UInt32Interval.AsObject;
  static serializeBinaryToWriter(message: UInt32Interval, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UInt32Interval;
  static deserializeBinaryFromReader(message: UInt32Interval, reader: jspb.BinaryReader): UInt32Interval;
}

export namespace UInt32Interval {
  export type AsObject = {
    start: number,
    end: number,
  }
}

export class Int32Interval extends jspb.Message {
  getStart(): number;
  setStart(value: number): Int32Interval;

  getEnd(): number;
  setEnd(value: number): Int32Interval;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Int32Interval.AsObject;
  static toObject(includeInstance: boolean, msg: Int32Interval): Int32Interval.AsObject;
  static serializeBinaryToWriter(message: Int32Interval, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Int32Interval;
  static deserializeBinaryFromReader(message: Int32Interval, reader: jspb.BinaryReader): Int32Interval;
}

export namespace Int32Interval {
  export type AsObject = {
    start: number,
    end: number,
  }
}

export class DateInterval extends jspb.Message {
  getStart(): number;
  setStart(value: number): DateInterval;

  getEnd(): number;
  setEnd(value: number): DateInterval;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DateInterval.AsObject;
  static toObject(includeInstance: boolean, msg: DateInterval): DateInterval.AsObject;
  static serializeBinaryToWriter(message: DateInterval, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DateInterval;
  static deserializeBinaryFromReader(message: DateInterval, reader: jspb.BinaryReader): DateInterval;
}

export namespace DateInterval {
  export type AsObject = {
    start: number,
    end: number,
  }
}

export class Report extends jspb.Message {
  getId(): string;
  setId(value: string): Report;

  getProblemSet(): ProblemSetReport | undefined;
  setProblemSet(value?: ProblemSetReport): Report;
  hasProblemSet(): boolean;
  clearProblemSet(): Report;

  getStartedAt(): number;
  setStartedAt(value: number): Report;

  getFinishedAt(): number;
  setFinishedAt(value: number): Report;

  getAuthor(): User | undefined;
  setAuthor(value?: User): Report;
  hasAuthor(): boolean;
  clearAuthor(): Report;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Report.AsObject;
  static toObject(includeInstance: boolean, msg: Report): Report.AsObject;
  static serializeBinaryToWriter(message: Report, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Report;
  static deserializeBinaryFromReader(message: Report, reader: jspb.BinaryReader): Report;
}

export namespace Report {
  export type AsObject = {
    id: string,
    problemSet?: ProblemSetReport.AsObject,
    startedAt: number,
    finishedAt: number,
    author?: User.AsObject,
  }
}

export class ProblemSetReport extends jspb.Message {
  getGeneratedProblemSetId(): string;
  setGeneratedProblemSetId(value: string): ProblemSetReport;

  getTitle(): string;
  setTitle(value: string): ProblemSetReport;

  getProblemsList(): Array<ProblemReport>;
  setProblemsList(value: Array<ProblemReport>): ProblemSetReport;
  clearProblemsList(): ProblemSetReport;
  addProblems(value?: ProblemReport, index?: number): ProblemReport;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProblemSetReport.AsObject;
  static toObject(includeInstance: boolean, msg: ProblemSetReport): ProblemSetReport.AsObject;
  static serializeBinaryToWriter(message: ProblemSetReport, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProblemSetReport;
  static deserializeBinaryFromReader(message: ProblemSetReport, reader: jspb.BinaryReader): ProblemSetReport;
}

export namespace ProblemSetReport {
  export type AsObject = {
    generatedProblemSetId: string,
    title: string,
    problemsList: Array<ProblemReport.AsObject>,
  }
}

export class ProblemReport extends jspb.Message {
  getGeneratedProblemId(): string;
  setGeneratedProblemId(value: string): ProblemReport;

  getTitle(): string;
  setTitle(value: string): ProblemReport;

  getView(): GeneratedView | undefined;
  setView(value?: GeneratedView): ProblemReport;
  hasView(): boolean;
  clearView(): ProblemReport;

  getUserAnswer(): ProblemReport.Answer | undefined;
  setUserAnswer(value?: ProblemReport.Answer): ProblemReport;
  hasUserAnswer(): boolean;
  clearUserAnswer(): ProblemReport;

  getExpectedAnswer(): string;
  setExpectedAnswer(value: string): ProblemReport;

  getIsCorrect(): boolean;
  setIsCorrect(value: boolean): ProblemReport;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProblemReport.AsObject;
  static toObject(includeInstance: boolean, msg: ProblemReport): ProblemReport.AsObject;
  static serializeBinaryToWriter(message: ProblemReport, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProblemReport;
  static deserializeBinaryFromReader(message: ProblemReport, reader: jspb.BinaryReader): ProblemReport;
}

export namespace ProblemReport {
  export type AsObject = {
    generatedProblemId: string,
    title: string,
    view?: GeneratedView.AsObject,
    userAnswer?: ProblemReport.Answer.AsObject,
    expectedAnswer: string,
    isCorrect: boolean,
  }

  export class Answer extends jspb.Message {
    getValue(): string;
    setValue(value: string): Answer;

    getTimestamp(): number;
    setTimestamp(value: number): Answer;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Answer.AsObject;
    static toObject(includeInstance: boolean, msg: Answer): Answer.AsObject;
    static serializeBinaryToWriter(message: Answer, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Answer;
    static deserializeBinaryFromReader(message: Answer, reader: jspb.BinaryReader): Answer;
  }

  export namespace Answer {
    export type AsObject = {
      value: string,
      timestamp: number,
    }
  }

}

export class Submission extends jspb.Message {
  getId(): string;
  setId(value: string): Submission;

  getProblemSet(): SubmissionProblemSet | undefined;
  setProblemSet(value?: SubmissionProblemSet): Submission;
  hasProblemSet(): boolean;
  clearProblemSet(): Submission;

  getStartedAt(): number;
  setStartedAt(value: number): Submission;

  getDeadline(): number;
  setDeadline(value: number): Submission;

  getCompleted(): boolean;
  setCompleted(value: boolean): Submission;

  getReportId(): google_protobuf_wrappers_pb.StringValue | undefined;
  setReportId(value?: google_protobuf_wrappers_pb.StringValue): Submission;
  hasReportId(): boolean;
  clearReportId(): Submission;

  getAuthor(): User | undefined;
  setAuthor(value?: User): Submission;
  hasAuthor(): boolean;
  clearAuthor(): Submission;

  getAnswersList(): Array<ProblemAnswer>;
  setAnswersList(value: Array<ProblemAnswer>): Submission;
  clearAnswersList(): Submission;
  addAnswers(value?: ProblemAnswer, index?: number): ProblemAnswer;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Submission.AsObject;
  static toObject(includeInstance: boolean, msg: Submission): Submission.AsObject;
  static serializeBinaryToWriter(message: Submission, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Submission;
  static deserializeBinaryFromReader(message: Submission, reader: jspb.BinaryReader): Submission;
}

export namespace Submission {
  export type AsObject = {
    id: string,
    problemSet?: SubmissionProblemSet.AsObject,
    startedAt: number,
    deadline: number,
    completed: boolean,
    reportId?: google_protobuf_wrappers_pb.StringValue.AsObject,
    author?: User.AsObject,
    answersList: Array<ProblemAnswer.AsObject>,
  }
}

export class SubmissionProblemSet extends jspb.Message {
  getId(): string;
  setId(value: string): SubmissionProblemSet;

  getTitle(): string;
  setTitle(value: string): SubmissionProblemSet;

  getProblemsList(): Array<SubmissionProblem>;
  setProblemsList(value: Array<SubmissionProblem>): SubmissionProblemSet;
  clearProblemsList(): SubmissionProblemSet;
  addProblems(value?: SubmissionProblem, index?: number): SubmissionProblem;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubmissionProblemSet.AsObject;
  static toObject(includeInstance: boolean, msg: SubmissionProblemSet): SubmissionProblemSet.AsObject;
  static serializeBinaryToWriter(message: SubmissionProblemSet, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubmissionProblemSet;
  static deserializeBinaryFromReader(message: SubmissionProblemSet, reader: jspb.BinaryReader): SubmissionProblemSet;
}

export namespace SubmissionProblemSet {
  export type AsObject = {
    id: string,
    title: string,
    problemsList: Array<SubmissionProblem.AsObject>,
  }
}

export class SubmissionProblem extends jspb.Message {
  getId(): string;
  setId(value: string): SubmissionProblem;

  getTitle(): string;
  setTitle(value: string): SubmissionProblem;

  getView(): GeneratedView | undefined;
  setView(value?: GeneratedView): SubmissionProblem;
  hasView(): boolean;
  clearView(): SubmissionProblem;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubmissionProblem.AsObject;
  static toObject(includeInstance: boolean, msg: SubmissionProblem): SubmissionProblem.AsObject;
  static serializeBinaryToWriter(message: SubmissionProblem, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubmissionProblem;
  static deserializeBinaryFromReader(message: SubmissionProblem, reader: jspb.BinaryReader): SubmissionProblem;
}

export namespace SubmissionProblem {
  export type AsObject = {
    id: string,
    title: string,
    view?: GeneratedView.AsObject,
  }
}

export class GeneratedView extends jspb.Message {
  getLanguage(): View.Language;
  setLanguage(value: View.Language): GeneratedView;

  getContent(): string;
  setContent(value: string): GeneratedView;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GeneratedView.AsObject;
  static toObject(includeInstance: boolean, msg: GeneratedView): GeneratedView.AsObject;
  static serializeBinaryToWriter(message: GeneratedView, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GeneratedView;
  static deserializeBinaryFromReader(message: GeneratedView, reader: jspb.BinaryReader): GeneratedView;
}

export namespace GeneratedView {
  export type AsObject = {
    language: View.Language,
    content: string,
  }
}

export class ProblemAnswer extends jspb.Message {
  getId(): string;
  setId(value: string): ProblemAnswer;

  getAnswer(): string;
  setAnswer(value: string): ProblemAnswer;

  getTimestamp(): number;
  setTimestamp(value: number): ProblemAnswer;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProblemAnswer.AsObject;
  static toObject(includeInstance: boolean, msg: ProblemAnswer): ProblemAnswer.AsObject;
  static serializeBinaryToWriter(message: ProblemAnswer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProblemAnswer;
  static deserializeBinaryFromReader(message: ProblemAnswer, reader: jspb.BinaryReader): ProblemAnswer;
}

export namespace ProblemAnswer {
  export type AsObject = {
    id: string,
    answer: string,
    timestamp: number,
  }
}

export class User extends jspb.Message {
  getId(): string;
  setId(value: string): User;

  getFirstName(): string;
  setFirstName(value: string): User;

  getLastName(): string;
  setLastName(value: string): User;

  getUsername(): string;
  setUsername(value: string): User;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): User.AsObject;
  static toObject(includeInstance: boolean, msg: User): User.AsObject;
  static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): User;
  static deserializeBinaryFromReader(message: User, reader: jspb.BinaryReader): User;
}

export namespace User {
  export type AsObject = {
    id: string,
    firstName: string,
    lastName: string,
    username: string,
  }
}

