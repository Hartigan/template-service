import { AuthService } from "./AuthService";
import { HttpService } from "./HttpService";

export class HttpServiceFactory {
    constructor(private authService: AuthService) {
    }

    create(baseUrl: string) {
        return new HttpService(baseUrl, this.authService);
    }
}