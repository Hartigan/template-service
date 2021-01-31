#!/bin/bash

rm -rf ./src/protobuf
mkdir ./src/protobuf

protoc -I=../Proto domain.proto examination.proto folders.proto groups.proto permissions.proto problems.proto problem_sets.proto users.proto version.proto    --js_out=import_style=commonjs,binary:./src/protobuf   --grpc-web_out=import_style=typescript,mode=grpcwebtext:./src/protobuf