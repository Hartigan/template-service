import { makeStyles, Grid } from "@material-ui/core";
import React from "react";
import GroupsListViewContainer from "../../groups/list/GroupsListViewContainer";
import GroupViewContainer from "../../groups/view/GroupViewContainer";

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

export interface IGroupsTabParameters {
};

export interface IGroupsTabActions {
};

export interface IGroupsTabProps extends IGroupsTabActions, IGroupsTabParameters{
};

export default function GroupsTab(props: IGroupsTabProps) {

    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <Grid item className={classes.tree}>
                <GroupsListViewContainer />
            </Grid>
            <Grid item className={classes.content}>
                <GroupViewContainer />
            </Grid>
        </Grid>
    );
};