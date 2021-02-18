/**
 * @fileoverview gRPC-Web generated client stub for users
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as users_pb from './users_pb';


export class UsersServiceClient {
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

  methodInfoInit = new grpcWeb.AbstractClientBase.MethodInfo(
    users_pb.InitReply,
    (request: users_pb.InitRequest) => {
      return request.serializeBinary();
    },
    users_pb.InitReply.deserializeBinary
  );

  init(
    request: users_pb.InitRequest,
    metadata: grpcWeb.Metadata | null): Promise<users_pb.InitReply>;

  init(
    request: users_pb.InitRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: users_pb.InitReply) => void): grpcWeb.ClientReadableStream<users_pb.InitReply>;

  init(
    request: users_pb.InitRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: users_pb.InitReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/users.UsersService/Init',
        request,
        metadata || {},
        this.methodInfoInit,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/users.UsersService/Init',
    request,
    metadata || {},
    this.methodInfoInit);
  }

  methodInfoGetUser = new grpcWeb.AbstractClientBase.MethodInfo(
    users_pb.GetUserReply,
    (request: users_pb.GetUserRequest) => {
      return request.serializeBinary();
    },
    users_pb.GetUserReply.deserializeBinary
  );

  getUser(
    request: users_pb.GetUserRequest,
    metadata: grpcWeb.Metadata | null): Promise<users_pb.GetUserReply>;

  getUser(
    request: users_pb.GetUserRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: users_pb.GetUserReply) => void): grpcWeb.ClientReadableStream<users_pb.GetUserReply>;

  getUser(
    request: users_pb.GetUserRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: users_pb.GetUserReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/users.UsersService/GetUser',
        request,
        metadata || {},
        this.methodInfoGetUser,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/users.UsersService/GetUser',
    request,
    metadata || {},
    this.methodInfoGetUser);
  }

  methodInfoSearch = new grpcWeb.AbstractClientBase.MethodInfo(
    users_pb.SearchReply,
    (request: users_pb.SearchRequest) => {
      return request.serializeBinary();
    },
    users_pb.SearchReply.deserializeBinary
  );

  search(
    request: users_pb.SearchRequest,
    metadata: grpcWeb.Metadata | null): Promise<users_pb.SearchReply>;

  search(
    request: users_pb.SearchRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: users_pb.SearchReply) => void): grpcWeb.ClientReadableStream<users_pb.SearchReply>;

  search(
    request: users_pb.SearchRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: users_pb.SearchReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/users.UsersService/Search',
        request,
        metadata || {},
        this.methodInfoSearch,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/users.UsersService/Search',
    request,
    metadata || {},
    this.methodInfoSearch);
  }

}

