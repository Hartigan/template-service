import { UserId } from "./Identificators";

export interface AdminUser {
    id: UserId;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    roles: Array<string>;
}