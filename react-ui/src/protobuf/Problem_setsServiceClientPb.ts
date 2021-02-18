/**
 * @fileoverview gRPC-Web generated client stub for problem_sets
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as problem_sets_pb from './problem_sets_pb';


export class ProblemSetsServiceClient {
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

  methodInfoGetProblemSet = new grpcWeb.AbstractClientBase.MethodInfo(
    problem_sets_pb.GetProblemSetReply,
    (request: problem_sets_pb.GetProblemSetRequest) => {
      return request.serializeBinary();
    },
    problem_sets_pb.GetProblemSetReply.deserializeBinary
  );

  getProblemSet(
    request: problem_sets_pb.GetProblemSetRequest,
    metadata: grpcWeb.Metadata | null): Promise<problem_sets_pb.GetProblemSetReply>;

  getProblemSet(
    request: problem_sets_pb.GetProblemSetRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: problem_sets_pb.GetProblemSetReply) => void): grpcWeb.ClientReadableStream<problem_sets_pb.GetProblemSetReply>;

  getProblemSet(
    request: problem_sets_pb.GetProblemSetRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: problem_sets_pb.GetProblemSetReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/problem_sets.ProblemSetsService/GetProblemSet',
        request,
        metadata || {},
        this.methodInfoGetProblemSet,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/problem_sets.ProblemSetsService/GetProblemSet',
    request,
    metadata || {},
    this.methodInfoGetProblemSet);
  }

  methodInfoCreateProblemSet = new grpcWeb.AbstractClientBase.MethodInfo(
    problem_sets_pb.CreateProblemSetReply,
    (request: problem_sets_pb.CreateProblemSetRequest) => {
      return request.serializeBinary();
    },
    problem_sets_pb.CreateProblemSetReply.deserializeBinary
  );

  createProblemSet(
    request: problem_sets_pb.CreateProblemSetRequest,
    metadata: grpcWeb.Metadata | null): Promise<problem_sets_pb.CreateProblemSetReply>;

  createProblemSet(
    request: problem_sets_pb.CreateProblemSetRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: problem_sets_pb.CreateProblemSetReply) => void): grpcWeb.ClientReadableStream<problem_sets_pb.CreateProblemSetReply>;

  createProblemSet(
    request: problem_sets_pb.CreateProblemSetRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: problem_sets_pb.CreateProblemSetReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/problem_sets.ProblemSetsService/CreateProblemSet',
        request,
        metadata || {},
        this.methodInfoCreateProblemSet,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/problem_sets.ProblemSetsService/CreateProblemSet',
    request,
    metadata || {},
    this.methodInfoCreateProblemSet);
  }

  methodInfoUpdateProblemSet = new grpcWeb.AbstractClientBase.MethodInfo(
    problem_sets_pb.UpdateProblemSetReply,
    (request: problem_sets_pb.UpdateProblemSetRequest) => {
      return request.serializeBinary();
    },
    problem_sets_pb.UpdateProblemSetReply.deserializeBinary
  );

  updateProblemSet(
    request: problem_sets_pb.UpdateProblemSetRequest,
    metadata: grpcWeb.Metadata | null): Promise<problem_sets_pb.UpdateProblemSetReply>;

  updateProblemSet(
    request: problem_sets_pb.UpdateProblemSetRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: problem_sets_pb.UpdateProblemSetReply) => void): grpcWeb.ClientReadableStream<problem_sets_pb.UpdateProblemSetReply>;

  updateProblemSet(
    request: problem_sets_pb.UpdateProblemSetRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: problem_sets_pb.UpdateProblemSetReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/problem_sets.ProblemSetsService/UpdateProblemSet',
        request,
        metadata || {},
        this.methodInfoUpdateProblemSet,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/problem_sets.ProblemSetsService/UpdateProblemSet',
    request,
    metadata || {},
    this.methodInfoUpdateProblemSet);
  }

}

