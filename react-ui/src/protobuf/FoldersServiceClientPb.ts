/**
 * @fileoverview gRPC-Web generated client stub for folders
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as folders_pb from './folders_pb';


export class FoldersServiceClient {
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

  methodInfoGetFolders = new grpcWeb.AbstractClientBase.MethodInfo(
    folders_pb.GetFoldersReply,
    (request: folders_pb.GetFoldersRequest) => {
      return request.serializeBinary();
    },
    folders_pb.GetFoldersReply.deserializeBinary
  );

  getFolders(
    request: folders_pb.GetFoldersRequest,
    metadata: grpcWeb.Metadata | null): Promise<folders_pb.GetFoldersReply>;

  getFolders(
    request: folders_pb.GetFoldersRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: folders_pb.GetFoldersReply) => void): grpcWeb.ClientReadableStream<folders_pb.GetFoldersReply>;

  getFolders(
    request: folders_pb.GetFoldersRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: folders_pb.GetFoldersReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/folders.FoldersService/GetFolders',
        request,
        metadata || {},
        this.methodInfoGetFolders,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/folders.FoldersService/GetFolders',
    request,
    metadata || {},
    this.methodInfoGetFolders);
  }

  methodInfoCreateFolder = new grpcWeb.AbstractClientBase.MethodInfo(
    folders_pb.CreateFolderReply,
    (request: folders_pb.CreateFolderRequest) => {
      return request.serializeBinary();
    },
    folders_pb.CreateFolderReply.deserializeBinary
  );

  createFolder(
    request: folders_pb.CreateFolderRequest,
    metadata: grpcWeb.Metadata | null): Promise<folders_pb.CreateFolderReply>;

  createFolder(
    request: folders_pb.CreateFolderRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: folders_pb.CreateFolderReply) => void): grpcWeb.ClientReadableStream<folders_pb.CreateFolderReply>;

  createFolder(
    request: folders_pb.CreateFolderRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: folders_pb.CreateFolderReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/folders.FoldersService/CreateFolder',
        request,
        metadata || {},
        this.methodInfoCreateFolder,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/folders.FoldersService/CreateFolder',
    request,
    metadata || {},
    this.methodInfoCreateFolder);
  }

  methodInfoGetRoot = new grpcWeb.AbstractClientBase.MethodInfo(
    folders_pb.GetRootReply,
    (request: folders_pb.GetRootRequest) => {
      return request.serializeBinary();
    },
    folders_pb.GetRootReply.deserializeBinary
  );

  getRoot(
    request: folders_pb.GetRootRequest,
    metadata: grpcWeb.Metadata | null): Promise<folders_pb.GetRootReply>;

  getRoot(
    request: folders_pb.GetRootRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: folders_pb.GetRootReply) => void): grpcWeb.ClientReadableStream<folders_pb.GetRootReply>;

  getRoot(
    request: folders_pb.GetRootRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: folders_pb.GetRootReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/folders.FoldersService/GetRoot',
        request,
        metadata || {},
        this.methodInfoGetRoot,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/folders.FoldersService/GetRoot',
    request,
    metadata || {},
    this.methodInfoGetRoot);
  }

  methodInfoGetTrash = new grpcWeb.AbstractClientBase.MethodInfo(
    folders_pb.GetTrashReply,
    (request: folders_pb.GetTrashRequest) => {
      return request.serializeBinary();
    },
    folders_pb.GetTrashReply.deserializeBinary
  );

  getTrash(
    request: folders_pb.GetTrashRequest,
    metadata: grpcWeb.Metadata | null): Promise<folders_pb.GetTrashReply>;

  getTrash(
    request: folders_pb.GetTrashRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: folders_pb.GetTrashReply) => void): grpcWeb.ClientReadableStream<folders_pb.GetTrashReply>;

  getTrash(
    request: folders_pb.GetTrashRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: folders_pb.GetTrashReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/folders.FoldersService/GetTrash',
        request,
        metadata || {},
        this.methodInfoGetTrash,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/folders.FoldersService/GetTrash',
    request,
    metadata || {},
    this.methodInfoGetTrash);
  }

  methodInfoMoveToTrash = new grpcWeb.AbstractClientBase.MethodInfo(
    folders_pb.MoveToTrashReply,
    (request: folders_pb.MoveToTrashRequest) => {
      return request.serializeBinary();
    },
    folders_pb.MoveToTrashReply.deserializeBinary
  );

  moveToTrash(
    request: folders_pb.MoveToTrashRequest,
    metadata: grpcWeb.Metadata | null): Promise<folders_pb.MoveToTrashReply>;

  moveToTrash(
    request: folders_pb.MoveToTrashRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: folders_pb.MoveToTrashReply) => void): grpcWeb.ClientReadableStream<folders_pb.MoveToTrashReply>;

  moveToTrash(
    request: folders_pb.MoveToTrashRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: folders_pb.MoveToTrashReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/folders.FoldersService/MoveToTrash',
        request,
        metadata || {},
        this.methodInfoMoveToTrash,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/folders.FoldersService/MoveToTrash',
    request,
    metadata || {},
    this.methodInfoMoveToTrash);
  }

  methodInfoRestoreFromTrash = new grpcWeb.AbstractClientBase.MethodInfo(
    folders_pb.RestoreFromTrashReply,
    (request: folders_pb.RestoreFromTrashRequest) => {
      return request.serializeBinary();
    },
    folders_pb.RestoreFromTrashReply.deserializeBinary
  );

  restoreFromTrash(
    request: folders_pb.RestoreFromTrashRequest,
    metadata: grpcWeb.Metadata | null): Promise<folders_pb.RestoreFromTrashReply>;

  restoreFromTrash(
    request: folders_pb.RestoreFromTrashRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: folders_pb.RestoreFromTrashReply) => void): grpcWeb.ClientReadableStream<folders_pb.RestoreFromTrashReply>;

  restoreFromTrash(
    request: folders_pb.RestoreFromTrashRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: folders_pb.RestoreFromTrashReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/folders.FoldersService/RestoreFromTrash',
        request,
        metadata || {},
        this.methodInfoRestoreFromTrash,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/folders.FoldersService/RestoreFromTrash',
    request,
    metadata || {},
    this.methodInfoRestoreFromTrash);
  }

  methodInfoMove = new grpcWeb.AbstractClientBase.MethodInfo(
    folders_pb.MoveReply,
    (request: folders_pb.MoveRequest) => {
      return request.serializeBinary();
    },
    folders_pb.MoveReply.deserializeBinary
  );

  move(
    request: folders_pb.MoveRequest,
    metadata: grpcWeb.Metadata | null): Promise<folders_pb.MoveReply>;

  move(
    request: folders_pb.MoveRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: folders_pb.MoveReply) => void): grpcWeb.ClientReadableStream<folders_pb.MoveReply>;

  move(
    request: folders_pb.MoveRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: folders_pb.MoveReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/folders.FoldersService/Move',
        request,
        metadata || {},
        this.methodInfoMove,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/folders.FoldersService/Move',
    request,
    metadata || {},
    this.methodInfoMove);
  }

  methodInfoRename = new grpcWeb.AbstractClientBase.MethodInfo(
    folders_pb.RenameReply,
    (request: folders_pb.RenameRequest) => {
      return request.serializeBinary();
    },
    folders_pb.RenameReply.deserializeBinary
  );

  rename(
    request: folders_pb.RenameRequest,
    metadata: grpcWeb.Metadata | null): Promise<folders_pb.RenameReply>;

  rename(
    request: folders_pb.RenameRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: folders_pb.RenameReply) => void): grpcWeb.ClientReadableStream<folders_pb.RenameReply>;

  rename(
    request: folders_pb.RenameRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: folders_pb.RenameReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/folders.FoldersService/Rename',
        request,
        metadata || {},
        this.methodInfoRename,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/folders.FoldersService/Rename',
    request,
    metadata || {},
    this.methodInfoRename);
  }

}

