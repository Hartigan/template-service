export class AuthSettings {
    public static Authority = process.env.REACT_APP_AUTHORITY ?? 'http://localhost';
    public static ClientId = process.env.REACT_APP_CLIENT_ID ?? 'template-service-ui-debug';
    public static ClientRoot = process.env.REACT_APP_PUBLIC_URL ?? 'http://localhost:3000/';
    public static ClientScope = 'web_api openid profile role';
}