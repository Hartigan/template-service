import { UserId, GroupId } from "./Identificators";

export interface Access {
    generate: boolean;
    read: boolean;
    write: boolean;
    admin: boolean;
}

export interface Member {
    user_id: UserId;
    name: string;
    access: Access;
}

export interface Group {
    id: GroupId;
    owner_id: UserId;
    name: string;
    description: string;
    members: Array<Member>;
}

export interface GroupAccess {
    group_id: GroupId;
    name: string;
    access: Access;
}

export interface Permissions {
    owner_id: UserId;
    groups: Array<GroupAccess>;
    members: Array<Member>;
}