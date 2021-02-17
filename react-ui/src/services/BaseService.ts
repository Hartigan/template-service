import { AuthService } from './AuthService';
import { Metadata } from 'grpc-web';

export class BaseService<T> {
    private authService : AuthService;
    protected client : T;

    constructor(authService: AuthService, client: T) {
        this.authService = authService;
        this.client = client;
    }

    doCall<TRequest, TReply>(method: (request: TRequest, metadata: Metadata | null) => Promise<TReply>) {
        return async (request: TRequest) => {
            const metadata = await this.authService.getAuthMetadata();
            return await method.call(this.client, request, metadata);
        };
    }
}