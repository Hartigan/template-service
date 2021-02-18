/**
 * @fileoverview gRPC-Web generated client stub for groups
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as groups_pb from './groups_pb';


export class GroupsServiceClient {
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

  methodInfoCreateGroup = new grpcWeb.AbstractClientBase.MethodInfo(
    groups_pb.CreateGroupReply,
    (request: groups_pb.CreateGroupRequest) => {
      return request.serializeBinary();
    },
    groups_pb.CreateGroupReply.deserializeBinary
  );

  createGroup(
    request: groups_pb.CreateGroupRequest,
    metadata: grpcWeb.Metadata | null): Promise<groups_pb.CreateGroupReply>;

  createGroup(
    request: groups_pb.CreateGroupRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: groups_pb.CreateGroupReply) => void): grpcWeb.ClientReadableStream<groups_pb.CreateGroupReply>;

  createGroup(
    request: groups_pb.CreateGroupRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: groups_pb.CreateGroupReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/groups.GroupsService/CreateGroup',
        request,
        metadata || {},
        this.methodInfoCreateGroup,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/groups.GroupsService/CreateGroup',
    request,
    metadata || {},
    this.methodInfoCreateGroup);
  }

  methodInfoGetGroup = new grpcWeb.AbstractClientBase.MethodInfo(
    groups_pb.GetGroupReply,
    (request: groups_pb.GetGroupRequest) => {
      return request.serializeBinary();
    },
    groups_pb.GetGroupReply.deserializeBinary
  );

  getGroup(
    request: groups_pb.GetGroupRequest,
    metadata: grpcWeb.Metadata | null): Promise<groups_pb.GetGroupReply>;

  getGroup(
    request: groups_pb.GetGroupRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: groups_pb.GetGroupReply) => void): grpcWeb.ClientReadableStream<groups_pb.GetGroupReply>;

  getGroup(
    request: groups_pb.GetGroupRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: groups_pb.GetGroupReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/groups.GroupsService/GetGroup',
        request,
        metadata || {},
        this.methodInfoGetGroup,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/groups.GroupsService/GetGroup',
    request,
    metadata || {},
    this.methodInfoGetGroup);
  }

  methodInfoGetGroups = new grpcWeb.AbstractClientBase.MethodInfo(
    groups_pb.GetGroupsReply,
    (request: groups_pb.GetGroupsRequest) => {
      return request.serializeBinary();
    },
    groups_pb.GetGroupsReply.deserializeBinary
  );

  getGroups(
    request: groups_pb.GetGroupsRequest,
    metadata: grpcWeb.Metadata | null): Promise<groups_pb.GetGroupsReply>;

  getGroups(
    request: groups_pb.GetGroupsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: groups_pb.GetGroupsReply) => void): grpcWeb.ClientReadableStream<groups_pb.GetGroupsReply>;

  getGroups(
    request: groups_pb.GetGroupsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: groups_pb.GetGroupsReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/groups.GroupsService/GetGroups',
        request,
        metadata || {},
        this.methodInfoGetGroups,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/groups.GroupsService/GetGroups',
    request,
    metadata || {},
    this.methodInfoGetGroups);
  }

  methodInfoUpdateGroup = new grpcWeb.AbstractClientBase.MethodInfo(
    groups_pb.UpdateGroupReply,
    (request: groups_pb.UpdateGroupRequest) => {
      return request.serializeBinary();
    },
    groups_pb.UpdateGroupReply.deserializeBinary
  );

  updateGroup(
    request: groups_pb.UpdateGroupRequest,
    metadata: grpcWeb.Metadata | null): Promise<groups_pb.UpdateGroupReply>;

  updateGroup(
    request: groups_pb.UpdateGroupRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: groups_pb.UpdateGroupReply) => void): grpcWeb.ClientReadableStream<groups_pb.UpdateGroupReply>;

  updateGroup(
    request: groups_pb.UpdateGroupRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: groups_pb.UpdateGroupReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/groups.GroupsService/UpdateGroup',
        request,
        metadata || {},
        this.methodInfoUpdateGroup,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/groups.GroupsService/UpdateGroup',
    request,
    metadata || {},
    this.methodInfoUpdateGroup);
  }

  methodInfoUpdateMember = new grpcWeb.AbstractClientBase.MethodInfo(
    groups_pb.UpdateMemberReply,
    (request: groups_pb.UpdateMemberRequest) => {
      return request.serializeBinary();
    },
    groups_pb.UpdateMemberReply.deserializeBinary
  );

  updateMember(
    request: groups_pb.UpdateMemberRequest,
    metadata: grpcWeb.Metadata | null): Promise<groups_pb.UpdateMemberReply>;

  updateMember(
    request: groups_pb.UpdateMemberRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: groups_pb.UpdateMemberReply) => void): grpcWeb.ClientReadableStream<groups_pb.UpdateMemberReply>;

  updateMember(
    request: groups_pb.UpdateMemberRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: groups_pb.UpdateMemberReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/groups.GroupsService/UpdateMember',
        request,
        metadata || {},
        this.methodInfoUpdateMember,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/groups.GroupsService/UpdateMember',
    request,
    metadata || {},
    this.methodInfoUpdateMember);
  }

  methodInfoRemoveMembers = new grpcWeb.AbstractClientBase.MethodInfo(
    groups_pb.RemoveMembersReply,
    (request: groups_pb.RemoveMembersRequest) => {
      return request.serializeBinary();
    },
    groups_pb.RemoveMembersReply.deserializeBinary
  );

  removeMembers(
    request: groups_pb.RemoveMembersRequest,
    metadata: grpcWeb.Metadata | null): Promise<groups_pb.RemoveMembersReply>;

  removeMembers(
    request: groups_pb.RemoveMembersRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: groups_pb.RemoveMembersReply) => void): grpcWeb.ClientReadableStream<groups_pb.RemoveMembersReply>;

  removeMembers(
    request: groups_pb.RemoveMembersRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: groups_pb.RemoveMembersReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/groups.GroupsService/RemoveMembers',
        request,
        metadata || {},
        this.methodInfoRemoveMembers,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/groups.GroupsService/RemoveMembers',
    request,
    metadata || {},
    this.methodInfoRemoveMembers);
  }

  methodInfoAddMembers = new grpcWeb.AbstractClientBase.MethodInfo(
    groups_pb.AddMembersReply,
    (request: groups_pb.AddMembersRequest) => {
      return request.serializeBinary();
    },
    groups_pb.AddMembersReply.deserializeBinary
  );

  addMembers(
    request: groups_pb.AddMembersRequest,
    metadata: grpcWeb.Metadata | null): Promise<groups_pb.AddMembersReply>;

  addMembers(
    request: groups_pb.AddMembersRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: groups_pb.AddMembersReply) => void): grpcWeb.ClientReadableStream<groups_pb.AddMembersReply>;

  addMembers(
    request: groups_pb.AddMembersRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: groups_pb.AddMembersReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/groups.GroupsService/AddMembers',
        request,
        metadata || {},
        this.methodInfoAddMembers,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/groups.GroupsService/AddMembers',
    request,
    metadata || {},
    this.methodInfoAddMembers);
  }

  methodInfoSearch = new grpcWeb.AbstractClientBase.MethodInfo(
    groups_pb.SearchReply,
    (request: groups_pb.SearchRequest) => {
      return request.serializeBinary();
    },
    groups_pb.SearchReply.deserializeBinary
  );

  search(
    request: groups_pb.SearchRequest,
    metadata: grpcWeb.Metadata | null): Promise<groups_pb.SearchReply>;

  search(
    request: groups_pb.SearchRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: groups_pb.SearchReply) => void): grpcWeb.ClientReadableStream<groups_pb.SearchReply>;

  search(
    request: groups_pb.SearchRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: groups_pb.SearchReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/groups.GroupsService/Search',
        request,
        metadata || {},
        this.methodInfoSearch,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/groups.GroupsService/Search',
    request,
    metadata || {},
    this.methodInfoSearch);
  }

}

