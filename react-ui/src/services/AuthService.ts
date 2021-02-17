import { Log, User, UserManager, WebStorageStateStore } from 'oidc-client';
import { AuthSettings } from '../settings/AuthSettings'
import { Metadata } from 'grpc-web';

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
            stateStore: new WebStorageStateStore({}),
        });

        this.userManager.events.addUserLoaded(() => {
            console.log("user loaded");
        })

        this.userManager.events.addUserUnloaded(() => {
            console.log("user unloaded");
        })

        this.userManager.events.addAccessTokenExpiring(async () => {
            console.log("user AccessTokenExpiring");
            await this.userManager.revokeAccessToken();
        })

        this.userManager.events.addAccessTokenExpired(async () => {
            console.log("user addAccessTokenExpired");
            await this.login();
        })

        Log.logger = console;
        Log.level = Log.INFO;
    }

    public getUser() : Promise<User | null> {
        return this.userManager.getUser();
    }

    public async getAuthMetadata() : Promise<Metadata> {
        const user = await this.getUser();
        if (user === null) {
            return {};
        }

        return {
            'Authorization': `${user.token_type} ${user.access_token}`
        }
    }

    public login() : Promise<void> {
        return this.userManager.signinRedirect();
    }

    public logout() : Promise<void> {
        return this.userManager.signoutRedirect();
    }
}
