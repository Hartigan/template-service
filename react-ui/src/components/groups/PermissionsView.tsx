import { makeStyles, Paper, Grid, IconButton, List } from "@material-ui/core";
import React, { useEffect } from "react";
import { PermissionsService, Protected } from "../../services/PermissionsService";
import { GroupId, UserId } from "../../models/Identificators";
import { Access, Permissions } from "../../models/Permissions";
import UserSearchView from "../common/UserSearchView";
import { UserService } from "../../services/UserService";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MemberListItemView from "./MemberListItemView";
import GroupSearchView from "../common/GroupSearchView";
import GroupListItemView from "./GroupListItemView";

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

export interface IPermissionsViewProps {
    permissionsService: PermissionsService;
    userService: UserService;
    protectedItem: Protected;
}

export default function PermissionsView(props: IPermissionsViewProps) {

    const [ state, setState ] = React.useState<IState>({
        protectedItem: null,
        permissions: null,
        newUserId: null,
        newGroupId: null
    });

    const refresh = () => {
        props.permissionsService
            .getPermissions(props.protectedItem)
            .then(permissions => {
                setState({
                    ...state,
                    permissions: permissions,
                    protectedItem: props.protectedItem
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
                props.protectedItem,
                state.newUserId
            );

        refresh();
    };

    const onRemoveMember = async (userId: UserId) => {
        await props.permissionsService.removePermissionsMember(
                props.protectedItem,
                userId
            );

        refresh();
    };

    const onUpdateMemberAccess = async (userId: UserId, access: Access) => {
        await props.permissionsService.updatePermissionsMember(
                props.protectedItem,
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
                props.protectedItem,
                state.newGroupId
            );

        refresh();
    };

    const onRemoveGroup = async (groupId: GroupId) => {
        await props.permissionsService.removePermissionsGroup(
                props.protectedItem,
                groupId
            );

        refresh();
    };

    const onUpdateGroupAccess = async (groupId: GroupId, access: Access) => {
        await props.permissionsService.updatePermissionsGroup(
                props.protectedItem,
                groupId,
                access
            );

        refresh();
    };

    const classes = useStyles();

    if (state.permissions) {
        return (
            <Paper className={classes.root}>
                <Grid container>
                    <Grid item className={classes.header}>
                        <Grid container className={classes.search}>
                            <Grid item className={classes.searchCell}>
                                <GroupSearchView
                                    permissionsService={props.permissionsService}
                                    onGroupSelected={setNewGroupId}
                                    />
                            </Grid>
                            <Grid item className={classes.searchButtons}>
                                <IconButton
                                    color="primary" aria-label="Add group"
                                    onClick={() => addGroup()}>
                                    <PersonAddIcon />
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