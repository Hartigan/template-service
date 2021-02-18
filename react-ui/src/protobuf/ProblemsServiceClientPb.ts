/**
 * @fileoverview gRPC-Web generated client stub for problems
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as problems_pb from './problems_pb';


export class ProblemsServiceClient {
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

  methodInfoGetProblem = new grpcWeb.AbstractClientBase.MethodInfo(
    problems_pb.GetProblemReply,
    (request: problems_pb.GetProblemRequest) => {
      return request.serializeBinary();
    },
    problems_pb.GetProblemReply.deserializeBinary
  );

  getProblem(
    request: problems_pb.GetProblemRequest,
    metadata: grpcWeb.Metadata | null): Promise<problems_pb.GetProblemReply>;

  getProblem(
    request: problems_pb.GetProblemRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: problems_pb.GetProblemReply) => void): grpcWeb.ClientReadableStream<problems_pb.GetProblemReply>;

  getProblem(
    request: problems_pb.GetProblemRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: problems_pb.GetProblemReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/problems.ProblemsService/GetProblem',
        request,
        metadata || {},
        this.methodInfoGetProblem,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/problems.ProblemsService/GetProblem',
    request,
    metadata || {},
    this.methodInfoGetProblem);
  }

  methodInfoTestProblem = new grpcWeb.AbstractClientBase.MethodInfo(
    problems_pb.TestProblemReply,
    (request: problems_pb.TestProblemRequest) => {
      return request.serializeBinary();
    },
    problems_pb.TestProblemReply.deserializeBinary
  );

  testProblem(
    request: problems_pb.TestProblemRequest,
    metadata: grpcWeb.Metadata | null): Promise<problems_pb.TestProblemReply>;

  testProblem(
    request: problems_pb.TestProblemRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: problems_pb.TestProblemReply) => void): grpcWeb.ClientReadableStream<problems_pb.TestProblemReply>;

  testProblem(
    request: problems_pb.TestProblemRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: problems_pb.TestProblemReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/problems.ProblemsService/TestProblem',
        request,
        metadata || {},
        this.methodInfoTestProblem,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/problems.ProblemsService/TestProblem',
    request,
    metadata || {},
    this.methodInfoTestProblem);
  }

  methodInfoValidate = new grpcWeb.AbstractClientBase.MethodInfo(
    problems_pb.ValidateReply,
    (request: problems_pb.ValidateRequest) => {
      return request.serializeBinary();
    },
    problems_pb.ValidateReply.deserializeBinary
  );

  validate(
    request: problems_pb.ValidateRequest,
    metadata: grpcWeb.Metadata | null): Promise<problems_pb.ValidateReply>;

  validate(
    request: problems_pb.ValidateRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: problems_pb.ValidateReply) => void): grpcWeb.ClientReadableStream<problems_pb.ValidateReply>;

  validate(
    request: problems_pb.ValidateRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: problems_pb.ValidateReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/problems.ProblemsService/Validate',
        request,
        metadata || {},
        this.methodInfoValidate,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/problems.ProblemsService/Validate',
    request,
    metadata || {},
    this.methodInfoValidate);
  }

  methodInfoCreateProblem = new grpcWeb.AbstractClientBase.MethodInfo(
    problems_pb.CreateProblemReply,
    (request: problems_pb.CreateProblemRequest) => {
      return request.serializeBinary();
    },
    problems_pb.CreateProblemReply.deserializeBinary
  );

  createProblem(
    request: problems_pb.CreateProblemRequest,
    metadata: grpcWeb.Metadata | null): Promise<problems_pb.CreateProblemReply>;

  createProblem(
    request: problems_pb.CreateProblemRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: problems_pb.CreateProblemReply) => void): grpcWeb.ClientReadableStream<problems_pb.CreateProblemReply>;

  createProblem(
    request: problems_pb.CreateProblemRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: problems_pb.CreateProblemReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/problems.ProblemsService/CreateProblem',
        request,
        metadata || {},
        this.methodInfoCreateProblem,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/problems.ProblemsService/CreateProblem',
    request,
    metadata || {},
    this.methodInfoCreateProblem);
  }

  methodInfoUpdateProblem = new grpcWeb.AbstractClientBase.MethodInfo(
    problems_pb.UpdateProblemReply,
    (request: problems_pb.UpdateProblemRequest) => {
      return request.serializeBinary();
    },
    problems_pb.UpdateProblemReply.deserializeBinary
  );

  updateProblem(
    request: problems_pb.UpdateProblemRequest,
    metadata: grpcWeb.Metadata | null): Promise<problems_pb.UpdateProblemReply>;

  updateProblem(
    request: problems_pb.UpdateProblemRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: problems_pb.UpdateProblemReply) => void): grpcWeb.ClientReadableStream<problems_pb.UpdateProblemReply>;

  updateProblem(
    request: problems_pb.UpdateProblemRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: problems_pb.UpdateProblemReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/problems.ProblemsService/UpdateProblem',
        request,
        metadata || {},
        this.methodInfoUpdateProblem,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/problems.ProblemsService/UpdateProblem',
    request,
    metadata || {},
    this.methodInfoUpdateProblem);
  }

}

