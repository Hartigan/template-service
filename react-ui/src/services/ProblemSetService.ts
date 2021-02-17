import { ProblemSetsServiceClient } from '../protobuf/Problem_setsServiceClientPb';
import { GetProblemSetRequest, CreateProblemSetRequest, UpdateProblemSetRequest, CreateProblemSetReply, GetProblemSetReply, UpdateProblemSetReply } from '../protobuf/problem_sets_pb';
import { GlobalSettings } from '../settings/GlobalSettings'
import { AuthService } from './AuthService';
import { BaseService } from './BaseService';

export class ProblemSetService extends BaseService<ProblemSetsServiceClient> {

    constructor(authService: AuthService) {
        super(authService, new ProblemSetsServiceClient(GlobalSettings.ApiBaseUrl));
    }

    getProblemSet(request: GetProblemSetRequest) {
        return this.doCall<GetProblemSetRequest, GetProblemSetReply>(this.client.getProblemSet)(request);
    }

    createProblemSet(request: CreateProblemSetRequest) {
        return this.doCall<CreateProblemSetRequest, CreateProblemSetReply>(this.client.createProblemSet)(request);
    }

    updateProblemSet(request: UpdateProblemSetRequest) {
        return this.doCall<UpdateProblemSetRequest, UpdateProblemSetReply>(this.client.updateProblemSet)(request);
    }
}
