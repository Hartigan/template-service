import { makeStyles, Paper, Grid, IconButton, List } from "@material-ui/core";
import React, { useEffect } from "react";
import { GroupId, UserId } from "../../../models/Identificators";
import { Group, Access } from "../../../models/Permissions";
import UserSearchView from "../../common/UserSearchView";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MemberListItemView from "../MemberListItemView";
import { PermissionCapability } from "../PermissionCapability";



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

export interface IGroupViewParameters {
    data: {
        loading: 'idle' | 'pending';
    } | {
        loading: 'succeeded';
        group: Group;
    };
    newUserId: UserId | null;
    groupId: GroupId | null;
}

export interface IGroupViewActions {
    fetchGroup(groupId: GroupId): void;
    addUser(groupId: GroupId, userId: UserId): void;
    removeUser(groupId: GroupId, userId: UserId): void;
    updateUserAccess(groupId: GroupId, userId: UserId, access: Access): void;
    setNewUser(userId: UserId | null): void;
}

export interface IGroupViewProps extends IGroupViewActions, IGroupViewParameters {
}

export default function GroupView(props: IGroupViewProps) {

    useEffect(() => {
        if (props.groupId === null) {
            return;
        }

        if (props.data.loading === 'idle' || (props.data.loading === 'succeeded' && props.data.group.id !== props.groupId)) {
            props.fetchGroup(props.groupId);
        }
    });

    const addUser = async () => {
        if (props.newUserId === null || props.data.loading !== 'succeeded') {
            return;
        }

        props.addUser(props.data.group.id, props.newUserId);
    };

    const onRemove = async (userId: UserId) => {
        if (props.data.loading !== 'succeeded') {
            return;
        }

        props.removeUser(props.data.group.id, userId);
    };

    const onUpdateAccess = async (userId: UserId, access: Access) => {
        if (props.data.loading !== 'succeeded') {
            return;
        }

        props.updateUserAccess(props.data.group.id, userId, access);
    };

    const classes = useStyles();

    if (props.data.loading === 'succeeded') {
        return (
            <Paper className={classes.root}>
                <Grid container>
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
                            {props.data.group.members.map(member => {
                                return (
                                    <MemberListItemView 
                                        key={member.user_id}
                                        member={member}
                                        capability={[
                                            PermissionCapability.Generate,
                                            PermissionCapability.Read,
                                            PermissionCapability.Write,
                                            PermissionCapability.Admin,
                                        ]}
                                        onRemove={onRemove}
                                        onUpdateAccess={onUpdateAccess}
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