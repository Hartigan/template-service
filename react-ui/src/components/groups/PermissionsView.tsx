import { makeStyles, Paper, Grid, IconButton, List, Typography, FormControlLabel, Checkbox } from "@material-ui/core";
import React, { useEffect } from "react";
import { PermissionsService, Protected, ProtectedId } from "../../services/PermissionsService";
import { GroupId, UserId } from "../../models/Identificators";
import { Access, Permissions } from "../../models/Permissions";
import UserSearchView from "../common/UserSearchView";
import { UserService } from "../../services/UserService";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import MemberListItemView from "./MemberListItemView";
import GroupSearchView from "../common/GroupSearchView";
import GroupListItemView from "./GroupListItemView";
import { GroupService } from "../../services/GroupService";
import { PermissionCapability } from "./PermissionCapability";
import { TargetType } from "../../models/Commit";

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

interface IState {
    permissions: Permissions | null;
    protectedItem : Protected | null;
    newUserId: UserId | null;
    newGroupId: GroupId | null;
}

export interface ProtectedItem {
    id: ProtectedId;
    type: TargetType | "report";
}

export interface IPermissionsViewProps {
    permissionsService: PermissionsService;
    groupService: GroupService;
    userService: UserService;
    protectedItem: ProtectedItem;
    title: string;
}

export default function PermissionsView(props: IPermissionsViewProps) {

    const [ state, setState ] = React.useState<IState>({
        protectedItem: null,
        permissions: null,
        newUserId: null,
        newGroupId: null
    });

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

    const refresh = () => {
        props.permissionsService
            .getPermissions(fromProtectedItem(props.protectedItem))
            .then(permissions => {
                setState({
                    ...state,
                    permissions: permissions,
                    protectedItem: fromProtectedItem(props.protectedItem)
                });
            });
    };

    useEffect(() => {
        if (state.protectedItem === null || state.protectedItem.id !== props.protectedItem.id) {
            refresh();
        }
    });

    const setNewUserId = (userId: UserId | null) => {
        setState({
            ...state,
            newUserId: userId
        });
    };

    const setNewGroupId = (groupId: GroupId | null) => {
        setState({
            ...state,
            newGroupId: groupId
        });
    };

    const addUser = async () => {
        if (state.newUserId === null) {
            return;
        }

        await props.permissionsService.addPermissionsMember(
                fromProtectedItem(props.protectedItem),
                state.newUserId
            );

        refresh();
    };

    const onRemoveMember = async (userId: UserId) => {
        await props.permissionsService.removePermissionsMember(
                fromProtectedItem(props.protectedItem),
                userId
            );

        refresh();
    };

    const onUpdateMemberAccess = async (userId: UserId, access: Access) => {
        await props.permissionsService.updatePermissionsMember(
                fromProtectedItem(props.protectedItem),
                userId,
                access
            );

        refresh();
    };

    const addGroup = async () => {
        if (state.newGroupId === null) {
            return;
        }

        await props.permissionsService.addPermissionsGroup(
                fromProtectedItem(props.protectedItem),
                state.newGroupId
            );

        refresh();
    };

    const onRemoveGroup = async (groupId: GroupId) => {
        await props.permissionsService.removePermissionsGroup(
                fromProtectedItem(props.protectedItem),
                groupId
            );

        refresh();
    };

    const onUpdateGroupAccess = async (groupId: GroupId, access: Access) => {
        await props.permissionsService.updatePermissionsGroup(
                fromProtectedItem(props.protectedItem),
                groupId,
                access
            );

        refresh();
    };

    const setIsPublic = async (isPublic: boolean) => {
        await props.permissionsService.setIsPublic(
            fromProtectedItem(props.protectedItem),
            isPublic
        );

        refresh();
    };

    const capabilities = function() {
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

    if (state.permissions) {
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
                                            control={<Checkbox color="primary" checked={state.permissions.is_public} onChange={(event, value) => setIsPublic(value)}/>}
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
                                    groupService={props.groupService}
                                    onGroupSelected={setNewGroupId}
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
                            {state.permissions.groups.map(groupAccess => {
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
                                    userService={props.userService}
                                    onUserSelected={setNewUserId}
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
                            {state.permissions.members.map(member => {
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