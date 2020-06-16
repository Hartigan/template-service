import { makeStyles, Paper, Grid, IconButton, List } from "@material-ui/core";
import React, { useEffect } from "react";
import { GroupId, UserId } from "../../models/Identificators";
import { Group, Access } from "../../models/Permissions";
import UserSearchView from "../common/UserSearchView";
import { UserService } from "../../services/UserService";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MemberListItemView from "./MemberListItemView";
import { GroupService } from "../../services/GroupService";



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
    group: Group | null;
    newUserId: UserId | null;
}

export interface IGroupViewProps {
    groupService: GroupService;
    userService: UserService;
    groupId: GroupId;
}

export default function GroupView(props: IGroupViewProps) {

    const [ state, setState ] = React.useState<IState>({
        group: null,
        newUserId: null
    });

    const refresh = () => {
        props.groupService
            .get(props.groupId)
            .then(group => {
                setState({
                    ...state,
                    group: group
                });
            });
    };

    useEffect(() => {
        if (state.group === null || state.group.id !== props.groupId) {
            refresh();
        }
    });

    const setNewUserId = (userId: UserId | null) => {
        setState({
            ...state,
            newUserId: userId
        });
    };

    const addUser = async () => {
        if (state.newUserId === null) {
            return;
        }

        await props.groupService.addMember(
                props.groupId,
                state.newUserId
            );

        refresh();
    };

    const onRemove = async (userId: UserId) => {
        await props.groupService.removeMember(
                props.groupId,
                userId
            );

        refresh();
    };

    const onUpdateAccess = async (userId: UserId, access: Access) => {
        await props.groupService.updateMember(
                props.groupId,
                userId,
                access
            );

        refresh();
    };

    const classes = useStyles();

    if (state.group) {
        return (
            <Paper className={classes.root}>
                <Grid container>
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
                            {state.group.members.map(member => {
                                return (
                                    <MemberListItemView 
                                        key={member.user_id}
                                        member={member}
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