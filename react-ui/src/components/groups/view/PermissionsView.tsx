import { makeStyles, Paper, Grid, IconButton, List, Typography, FormControlLabel, Checkbox } from "@material-ui/core";
import React, { useEffect } from "react";
import { Protected, ProtectedId } from "../../../services/PermissionsService";
import { GroupId, UserId } from "../../../models/Identificators";
import { Access, Permissions } from "../../../models/Permissions";
import UserSearchView from "../../common/UserSearchView";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import MemberListItemView from "../MemberListItemView";
import GroupSearchView from "../../common/GroupSearchView";
import { PermissionCapability } from "../PermissionCapability";
import { TargetType } from "../../../models/Commit";
import GroupListItemView from "../list/GroupListItemView";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
    header: {
        width: "100%",
    },
    content: {
        width: "100%",
    },
    membersList: {
        width: "100%",
    },
    title: {
        width: "100%",
    },
    search: {
        margin: "20px",
    },
    searchCell: {
        width: "300px",
    },
    searchButtons: {
    }
}));

export interface ProtectedItem {
    id: ProtectedId;
    type: TargetType | "report";
};

export interface IPermissionsViewParameters {
    protectedItem: ProtectedItem | null;
    title: string;

    data: {
        loading: 'idle' | 'pending';
    } | {
        loading: 'succeeded';
        permissions: Permissions;
        protected: Protected;
    };
    newUserId: UserId | null;
    newGroupId: GroupId | null;
};

export interface IPermissionsViewActions {
    fetchPermissions(item: Protected): void;
    setNewUser(userId: UserId | null): void;
    setNewGroup(groupId: GroupId | null): void;
    addMember(item: Protected, userId: UserId): void;
    removeMember(item: Protected, userId: UserId): void;
    updateMemberAccess(item: Protected, userId: UserId, access: Access): void;
    addGroup(item: Protected, groupId: GroupId): void;
    removeGroup(item: Protected, groupId: GroupId): void;
    updateGroupAccess(item: Protected, groupId: GroupId, access: Access): void;
    setIsPublic(item: Protected, isPublic: boolean): void;
};

export interface IPermissionsViewProps extends IPermissionsViewParameters, IPermissionsViewActions {
};

export default function PermissionsView(props: IPermissionsViewProps) {

    const fromProtectedItem = (item: ProtectedItem) => {
        switch (item.type) {
            case "report":
                return {
                    id: item.id,
                    type: "report"
                } as Protected;
            case "problem":
            case "problem_set":
                return {
                    id: item.id,
                    type: "head"
                } as Protected;
        }
    };

    useEffect(() => {
        if (props.protectedItem === null) {
            return;
        }

        if (props.data.loading === 'idle' || (props.data.loading === 'succeeded' && props.data.protected.id !== props.protectedItem.id)) {
            props.fetchPermissions(fromProtectedItem(props.protectedItem));
        }
    });

    const addUser = () => {
        if (props.newUserId === null || props.data.loading !== 'succeeded') {
            return;
        }
        props.addMember(props.data.protected, props.newUserId);
    };

    const onRemoveMember = (userId: UserId) => {
        if (props.data.loading !== 'succeeded') {
            return;
        }
        props.removeMember(props.data.protected, userId);
    };

    const onUpdateMemberAccess = (userId: UserId, access: Access) => {
        if (props.data.loading !== 'succeeded') {
            return;
        }
        props.updateMemberAccess(props.data.protected, userId, access);
    };

    const addGroup = () => {
        if (props.newGroupId === null || props.data.loading !== 'succeeded') {
            return;
        }
        props.addGroup(props.data.protected, props.newGroupId);
    };

    const onRemoveGroup = (groupId: GroupId) => {
        if (props.data.loading !== 'succeeded') {
            return;
        }
        props.removeGroup(props.data.protected, groupId);
    };

    const onUpdateGroupAccess = (groupId: GroupId, access: Access) => {
        if (props.data.loading !== 'succeeded') {
            return;
        }
        props.updateGroupAccess(props.data.protected, groupId, access);
    };

    const setIsPublic = (isPublic: boolean) => {
        if (props.data.loading !== 'succeeded') {
            return;
        }
        props.setIsPublic(props.data.protected, isPublic);
    };

    const capabilities = function() {
        if (props.protectedItem === null) {
            return [];
        }

        switch (props.protectedItem.type) {
            case "report":
                return [ PermissionCapability.Read, PermissionCapability.Admin ];
            case "problem_set":
                return [ PermissionCapability.Generate, PermissionCapability.Admin ];
            case "problem":
                return [ PermissionCapability.Generate, PermissionCapability.Read, PermissionCapability.Write, PermissionCapability.Admin ];
        }
    }();

    const classes = useStyles();

    if (props.data.loading === 'succeeded' && props.protectedItem !== null) {
        return (
            <Paper className={classes.root}>
                <Grid container>
                    <Grid item className={classes.header}>
                        <Grid container className={classes.search}>
                            <Grid item className={classes.title}>
                                <Typography variant="h5">
                                    {props.title}
                                </Typography>
                            </Grid>
                            {props.protectedItem.type === "problem_set"
                                ? (
                                    <Grid item className={classes.searchButtons}>
                                        <FormControlLabel
                                            control={<Checkbox color="primary" checked={props.data.permissions.is_public} onChange={(event, value) => setIsPublic(value)}/>}
                                            label="Public generate"
                                            labelPlacement="start"
                                            />
                                    </Grid>
                                )
                                : null}
                        </Grid>
                    </Grid>
                    <Grid item className={classes.header}>
                        <Grid container className={classes.search}>
                            <Grid item className={classes.searchCell}>
                                <GroupSearchView
                                    onGroupSelected={props.setNewGroup}
                                    />
                            </Grid>
                            <Grid item className={classes.searchButtons}>
                                <IconButton
                                    color="primary" aria-label="Add group"
                                    onClick={() => addGroup()}>
                                    <GroupAddIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item className={classes.content}>
                        <List component="nav" className={classes.membersList}>
                            {props.data.permissions.groups.map(groupAccess => {
                                return (
                                    <GroupListItemView 
                                        key={groupAccess.group_id}
                                        groupAccess={groupAccess}
                                        capability={capabilities}
                                        onRemove={onRemoveGroup}
                                        onUpdateAccess={onUpdateGroupAccess}
                                        />
                                )
                            })}
                        </List>
                    </Grid>
                    <Grid item className={classes.header}>
                        <Grid container className={classes.search}>
                            <Grid item className={classes.searchCell}>
                                <UserSearchView
                                    onUserSelected={props.setNewUser}
                                    />
                            </Grid>
                            <Grid item className={classes.searchButtons}>
                                <IconButton
                                    color="primary" aria-label="Add user"
                                    onClick={() => addUser()}>
                                    <PersonAddIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item className={classes.content}>
                        <List component="nav" className={classes.membersList}>
                            {props.data.permissions.members.map(member => {
                                return (
                                    <MemberListItemView 
                                        key={member.user_id}
                                        member={member}
                                        onRemove={onRemoveMember}
                                        capability={capabilities}
                                        onUpdateAccess={onUpdateMemberAccess}
                                        />
                                )
                            })}
                        </List>
                    </Grid>
                </Grid>
            </Paper>
        );
    }

    return (
        <Paper className={classes.root}>
        </Paper>
    );
};