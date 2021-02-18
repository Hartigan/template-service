/**
 * @fileoverview gRPC-Web generated client stub for permissions
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as permissions_pb from './permissions_pb';


export class PermissionsServiceClient {
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

  methodInfoGetPermissions = new grpcWeb.AbstractClientBase.MethodInfo(
    permissions_pb.GetPermissionsReply,
    (request: permissions_pb.GetPermissionsRequest) => {
      return request.serializeBinary();
    },
    permissions_pb.GetPermissionsReply.deserializeBinary
  );

  getPermissions(
    request: permissions_pb.GetPermissionsRequest,
    metadata: grpcWeb.Metadata | null): Promise<permissions_pb.GetPermissionsReply>;

  getPermissions(
    request: permissions_pb.GetPermissionsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: permissions_pb.GetPermissionsReply) => void): grpcWeb.ClientReadableStream<permissions_pb.GetPermissionsReply>;

  getPermissions(
    request: permissions_pb.GetPermissionsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: permissions_pb.GetPermissionsReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/permissions.PermissionsService/GetPermissions',
        request,
        metadata || {},
        this.methodInfoGetPermissions,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/permissions.PermissionsService/GetPermissions',
    request,
    metadata || {},
    this.methodInfoGetPermissions);
  }

  methodInfoSetIsPublic = new grpcWeb.AbstractClientBase.MethodInfo(
    permissions_pb.SetIsPublicReply,
    (request: permissions_pb.SetIsPublicRequest) => {
      return request.serializeBinary();
    },
    permissions_pb.SetIsPublicReply.deserializeBinary
  );

  setIsPublic(
    request: permissions_pb.SetIsPublicRequest,
    metadata: grpcWeb.Metadata | null): Promise<permissions_pb.SetIsPublicReply>;

  setIsPublic(
    request: permissions_pb.SetIsPublicRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: permissions_pb.SetIsPublicReply) => void): grpcWeb.ClientReadableStream<permissions_pb.SetIsPublicReply>;

  setIsPublic(
    request: permissions_pb.SetIsPublicRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: permissions_pb.SetIsPublicReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/permissions.PermissionsService/SetIsPublic',
        request,
        metadata || {},
        this.methodInfoSetIsPublic,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/permissions.PermissionsService/SetIsPublic',
    request,
    metadata || {},
    this.methodInfoSetIsPublic);
  }

  methodInfoGetAccessInfo = new grpcWeb.AbstractClientBase.MethodInfo(
    permissions_pb.GetAccessInfoReply,
    (request: permissions_pb.GetAccessInfoRequest) => {
      return request.serializeBinary();
    },
    permissions_pb.GetAccessInfoReply.deserializeBinary
  );

  getAccessInfo(
    request: permissions_pb.GetAccessInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<permissions_pb.GetAccessInfoReply>;

  getAccessInfo(
    request: permissions_pb.GetAccessInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: permissions_pb.GetAccessInfoReply) => void): grpcWeb.ClientReadableStream<permissions_pb.GetAccessInfoReply>;

  getAccessInfo(
    request: permissions_pb.GetAccessInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: permissions_pb.GetAccessInfoReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/permissions.PermissionsService/GetAccessInfo',
        request,
        metadata || {},
        this.methodInfoGetAccessInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/permissions.PermissionsService/GetAccessInfo',
    request,
    metadata || {},
    this.methodInfoGetAccessInfo);
  }

  methodInfoUpdatePermissions = new grpcWeb.AbstractClientBase.MethodInfo(
    permissions_pb.UpdatePermissionsReply,
    (request: permissions_pb.UpdatePermissionsRequest) => {
      return request.serializeBinary();
    },
    permissions_pb.UpdatePermissionsReply.deserializeBinary
  );

  updatePermissions(
    request: permissions_pb.UpdatePermissionsRequest,
    metadata: grpcWeb.Metadata | null): Promise<permissions_pb.UpdatePermissionsReply>;

  updatePermissions(
    request: permissions_pb.UpdatePermissionsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: permissions_pb.UpdatePermissionsReply) => void): grpcWeb.ClientReadableStream<permissions_pb.UpdatePermissionsReply>;

  updatePermissions(
    request: permissions_pb.UpdatePermissionsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: permissions_pb.UpdatePermissionsReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/permissions.PermissionsService/UpdatePermissions',
        request,
        metadata || {},
        this.methodInfoUpdatePermissions,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/permissions.PermissionsService/UpdatePermissions',
    request,
    metadata || {},
    this.methodInfoUpdatePermissions);
  }

  methodInfoAddMembers = new grpcWeb.AbstractClientBase.MethodInfo(
    permissions_pb.AddMembersReply,
    (request: permissions_pb.AddMembersRequest) => {
      return request.serializeBinary();
    },
    permissions_pb.AddMembersReply.deserializeBinary
  );

  addMembers(
    request: permissions_pb.AddMembersRequest,
    metadata: grpcWeb.Metadata | null): Promise<permissions_pb.AddMembersReply>;

  addMembers(
    request: permissions_pb.AddMembersRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: permissions_pb.AddMembersReply) => void): grpcWeb.ClientReadableStream<permissions_pb.AddMembersReply>;

  addMembers(
    request: permissions_pb.AddMembersRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: permissions_pb.AddMembersReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/permissions.PermissionsService/AddMembers',
        request,
        metadata || {},
        this.methodInfoAddMembers,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/permissions.PermissionsService/AddMembers',
    request,
    metadata || {},
    this.methodInfoAddMembers);
  }

  methodInfoRemoveMembers = new grpcWeb.AbstractClientBase.MethodInfo(
    permissions_pb.RemoveMembersReply,
    (request: permissions_pb.RemoveMembersRequest) => {
      return request.serializeBinary();
    },
    permissions_pb.RemoveMembersReply.deserializeBinary
  );

  removeMembers(
    request: permissions_pb.RemoveMembersRequest,
    metadata: grpcWeb.Metadata | null): Promise<permissions_pb.RemoveMembersReply>;

  removeMembers(
    request: permissions_pb.RemoveMembersRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: permissions_pb.RemoveMembersReply) => void): grpcWeb.ClientReadableStream<permissions_pb.RemoveMembersReply>;

  removeMembers(
    request: permissions_pb.RemoveMembersRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: permissions_pb.RemoveMembersReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/permissions.PermissionsService/RemoveMembers',
        request,
        metadata || {},
        this.methodInfoRemoveMembers,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/permissions.PermissionsService/RemoveMembers',
    request,
    metadata || {},
    this.methodInfoRemoveMembers);
  }

}

