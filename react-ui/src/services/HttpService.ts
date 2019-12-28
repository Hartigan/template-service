import { AuthService } from "./AuthService";

export class HttpService {

    constructor(
        private baseUrl: string,
        private authService: AuthService
    ) {
    }

    get<T>(relative: string): Promise<T> {
        return this
            .fetch(
                `${this.baseUrl}/${relative}`,
                'GET',
                {
                    'Accept': 'application/json'
                }
            )
            .then(response => response.json());
    }

    post<T>(relative: string, body: any): Promise<T> {
        return this
            .fetch(
                `${this.baseUrl}/${relative}`,
                'POST',
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                JSON.stringify(body)
            )
            .then(response => response.json());
    }

    private fetch(input: RequestInfo, method: string, headers: HeadersInit, body?: BodyInit) {
        return this.authService
            .getUser()
            .then(user => {
                if (user && user.access_token) {
                    let authHeaders = {
                        'Authorization': `${user.token_type} ${user.access_token}`
                    };

                    return fetch(input, {
                        body: body,
                        method: method,
                        headers: {...authHeaders, ...headers}
                    });
                } else {
                    this.authService.login();
                    throw new Error('No login');
                }
            })
    }
}