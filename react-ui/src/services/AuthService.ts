import { Log, User, UserManager, WebStorageStateStore } from 'oidc-client';
import { AuthSettings } from '../settings/AuthSettings'

export class AuthService {
    public userManager: UserManager;

    constructor() {
        this.userManager = new UserManager({
            authority: AuthSettings.Authority,
            client_id: AuthSettings.ClientId,
            redirect_uri: `${AuthSettings.ClientRoot}signin-callback.html`,
            post_logout_redirect_uri: `${AuthSettings.ClientRoot}signout-callback.html`,
            response_type: 'id_token token',
            scope: AuthSettings.ClientScope,
            stateStore: new WebStorageStateStore({})
        });

        Log.logger = console;
        Log.level = Log.INFO;
    }

    public getUser() : Promise<User | null> {
        return this.userManager.getUser();
    }

    public login() : Promise<void> {
        return this.userManager.signinRedirect();
    }

    public logout() : Promise<void> {
        return this.userManager.signoutRedirect();
    }
}
