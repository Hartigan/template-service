/**
 * @fileoverview gRPC-Web generated client stub for version
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as version_pb from './version_pb';


export class VersionServiceClient {
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

  methodInfoGetHeads = new grpcWeb.AbstractClientBase.MethodInfo(
    version_pb.GetHeadsReply,
    (request: version_pb.GetHeadsRequest) => {
      return request.serializeBinary();
    },
    version_pb.GetHeadsReply.deserializeBinary
  );

  getHeads(
    request: version_pb.GetHeadsRequest,
    metadata: grpcWeb.Metadata | null): Promise<version_pb.GetHeadsReply>;

  getHeads(
    request: version_pb.GetHeadsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: version_pb.GetHeadsReply) => void): grpcWeb.ClientReadableStream<version_pb.GetHeadsReply>;

  getHeads(
    request: version_pb.GetHeadsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: version_pb.GetHeadsReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/version.VersionService/GetHeads',
        request,
        metadata || {},
        this.methodInfoGetHeads,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/version.VersionService/GetHeads',
    request,
    metadata || {},
    this.methodInfoGetHeads);
  }

  methodInfoGetCommit = new grpcWeb.AbstractClientBase.MethodInfo(
    version_pb.GetCommitReply,
    (request: version_pb.GetCommitRequest) => {
      return request.serializeBinary();
    },
    version_pb.GetCommitReply.deserializeBinary
  );

  getCommit(
    request: version_pb.GetCommitRequest,
    metadata: grpcWeb.Metadata | null): Promise<version_pb.GetCommitReply>;

  getCommit(
    request: version_pb.GetCommitRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: version_pb.GetCommitReply) => void): grpcWeb.ClientReadableStream<version_pb.GetCommitReply>;

  getCommit(
    request: version_pb.GetCommitRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: version_pb.GetCommitReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/version.VersionService/GetCommit',
        request,
        metadata || {},
        this.methodInfoGetCommit,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/version.VersionService/GetCommit',
    request,
    metadata || {},
    this.methodInfoGetCommit);
  }

  methodInfoUpdateTags = new grpcWeb.AbstractClientBase.MethodInfo(
    version_pb.UpdateTagsReply,
    (request: version_pb.UpdateTagsRequest) => {
      return request.serializeBinary();
    },
    version_pb.UpdateTagsReply.deserializeBinary
  );

  updateTags(
    request: version_pb.UpdateTagsRequest,
    metadata: grpcWeb.Metadata | null): Promise<version_pb.UpdateTagsReply>;

  updateTags(
    request: version_pb.UpdateTagsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: version_pb.UpdateTagsReply) => void): grpcWeb.ClientReadableStream<version_pb.UpdateTagsReply>;

  updateTags(
    request: version_pb.UpdateTagsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: version_pb.UpdateTagsReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/version.VersionService/UpdateTags',
        request,
        metadata || {},
        this.methodInfoUpdateTags,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/version.VersionService/UpdateTags',
    request,
    metadata || {},
    this.methodInfoUpdateTags);
  }

  methodInfoSearch = new grpcWeb.AbstractClientBase.MethodInfo(
    version_pb.SearchReply,
    (request: version_pb.SearchRequest) => {
      return request.serializeBinary();
    },
    version_pb.SearchReply.deserializeBinary
  );

  search(
    request: version_pb.SearchRequest,
    metadata: grpcWeb.Metadata | null): Promise<version_pb.SearchReply>;

  search(
    request: version_pb.SearchRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: version_pb.SearchReply) => void): grpcWeb.ClientReadableStream<version_pb.SearchReply>;

  search(
    request: version_pb.SearchRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: version_pb.SearchReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/version.VersionService/Search',
        request,
        metadata || {},
        this.methodInfoSearch,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/version.VersionService/Search',
    request,
    metadata || {},
    this.methodInfoSearch);
  }

}

