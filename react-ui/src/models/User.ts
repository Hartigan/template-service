import { UserId } from "./Identificators";

export interface User {
    id: UserId;
    first_name: string;
    last_name: string;
    username: string;
}