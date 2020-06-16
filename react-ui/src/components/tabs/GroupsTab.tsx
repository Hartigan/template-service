import { makeStyles, Grid } from "@material-ui/core";
import React from "react";
import GroupsListView from "../groups/GroupsListView";
import GroupView from "../groups/GroupView";
import { UserService } from "../../services/UserService";
import { GroupId } from "../../models/Identificators";
import { GroupService } from "../../services/GroupService";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
    tree: {
        width: "30%",
        height: "100%",
    },
    content: {
        width: "70%",
        height: "100%",
    },
}));

interface IState {
    currentGroup: GroupId | null;
}

export interface IGroupsTabProps {
    groupService: GroupService;
    userService: UserService;
}

export default function GroupsTab(props: IGroupsTabProps) {

    const [ state, setState ] = React.useState<IState>({
        currentGroup: null
    });

    const changeCurrentGroup = (groupId: GroupId) => {
        setState({
            ...state,
            currentGroup: groupId
        });
    };

    const classes = useStyles();

    const groupView = state.currentGroup ? (
        <GroupView
            userService={props.userService}
            groupService={props.groupService}
            groupId={state.currentGroup}
            />
    ) : null;

    return (
        <Grid container className={classes.root}>
            <Grid item className={classes.tree}>
                <GroupsListView
                    groupService={props.groupService}
                    onCurrentGroupChange={changeCurrentGroup}
                    currentGroup={state.currentGroup} />
            </Grid>
            <Grid item className={classes.content}>
                {groupView}
            </Grid>
        </Grid>
    );
};