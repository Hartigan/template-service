import { ProblemsServiceClient } from '../protobuf/ProblemsServiceClientPb';
import { GetProblemRequest, TestProblemRequest, ValidateRequest, CreateProblemRequest, UpdateProblemRequest, CreateProblemReply, GetProblemReply, TestProblemReply, UpdateProblemReply, ValidateReply } from '../protobuf/problems_pb';
import { GlobalSettings } from '../settings/GlobalSettings'
import { AuthService } from './AuthService';
import { BaseService } from './BaseService';

export class ProblemsService extends BaseService<ProblemsServiceClient> {

    constructor(authService: AuthService) {
        super(authService, new ProblemsServiceClient(GlobalSettings.ApiBaseUrl));
    }

    getProblem(request: GetProblemRequest) {
        return this.doCall<GetProblemRequest, GetProblemReply>(this.client.getProblem)(request);
    }

    testProblem(request: TestProblemRequest) {
        return this.doCall<TestProblemRequest, TestProblemReply>(this.client.testProblem)(request);
    }

    validate(request: ValidateRequest) {
        return this.doCall<ValidateRequest, ValidateReply>(this.client.validate)(request);
    }

    createProblem(request: CreateProblemRequest) {
        return this.doCall<CreateProblemRequest, CreateProblemReply>(this.client.createProblem)(request);
    }

    updateProblem(request: UpdateProblemRequest) {
        return this.doCall<UpdateProblemRequest, UpdateProblemReply>(this.client.updateProblem)(request);
    }
}
