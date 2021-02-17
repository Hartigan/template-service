import { makeStyles, Paper, Grid, IconButton, List, Typography, FormControlLabel, Checkbox } from "@material-ui/core";
import React, { useEffect } from "react";
import { GroupId, UserId } from "../../../models/Identificators";
import UserSearchView from "../../common/UserSearchView";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import MemberListItemView from "../MemberListItemView";
import GroupSearchView from "../../common/GroupSearchView";
import { PermissionCapability } from "../PermissionCapability";
import GroupListItemView from "../list/GroupListItemView";
import { AccessModel, PermissionsModel, ProtectedItemModel } from "../../../models/domain";
import { ProtectedItem } from "../../../protobuf/domain_pb";

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

export interface IPermissionsViewParameters {
    protectedItem: ProtectedItemModel | null;
    title: string;

    data: {
        loading: 'idle' | 'pending';
    } | {
        loading: 'succeeded';
        permissions: PermissionsModel;
        protected: ProtectedItemModel;
    };
    newUserId: UserId | null;
    newGroupId: GroupId | null;
};

export interface IPermissionsViewActions {
    fetchPermissions(item: ProtectedItemModel): void;
    setNewUser(userId: UserId | null): void;
    setNewGroup(groupId: GroupId | null): void;
    addMember(item: ProtectedItemModel, userId: UserId): void;
    removeMember(item: ProtectedItemModel, userId: UserId): void;
    updateMemberAccess(item: ProtectedItemModel, userId: UserId, access: AccessModel): void;
    addGroup(item: ProtectedItemModel, groupId: GroupId): void;
    removeGroup(item: ProtectedItemModel, groupId: GroupId): void;
    updateGroupAccess(item: ProtectedItemModel, groupId: GroupId, access: AccessModel): void;
    setIsPublic(item: ProtectedItemModel, isPublic: boolean): void;
};

export interface IPermissionsViewProps extends IPermissionsViewParameters, IPermissionsViewActions {
};

export default function PermissionsView(props: IPermissionsViewProps) {

    useEffect(() => {
        if (props.protectedItem === null) {
            return;
        }

        if (props.data.loading === 'idle' || (props.data.loading === 'succeeded' && props.data.protected.id !== props.protectedItem.id)) {
            props.fetchPermissions(props.protectedItem);
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

    const onUpdateMemberAccess = (userId: UserId, access: AccessModel) => {
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

    const onUpdateGroupAccess = (groupId: GroupId, access: AccessModel) => {
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
            case ProtectedItem.ProtectedType.REPORT:
                return [ PermissionCapability.Read, PermissionCapability.Admin ];
            case ProtectedItem.ProtectedType.HEAD:
                return [ PermissionCapability.Generate, PermissionCapability.Read, PermissionCapability.Write, PermissionCapability.Admin ];
            default:
                return [];
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
                            {props.protectedItem.type === ProtectedItem.ProtectedType.HEAD
                                ? (
                                    <Grid item className={classes.searchButtons}>
                                        <FormControlLabel
                                            control={<Checkbox color="primary" checked={props.data.permissions.isPublic} onChange={(event, value) => setIsPublic(value)}/>}
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
                            {props.data.permissions.groupsList.map(groupAccess => {
                                return (
                                    <GroupListItemView 
                                        key={groupAccess.groupId}
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
                            {props.data.permissions.membersList.map(member => {
                                return (
                                    <MemberListItemView 
                                        key={member.userId}
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