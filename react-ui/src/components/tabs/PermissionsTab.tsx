import { makeStyles, Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import { PermissionsService } from "../../services/PermissionsService";
import { UserService } from "../../services/UserService";
import { FoldersService } from "../../services/FoldersService";
import PermissionsView from "../groups/PermissionsView";
import { VersionService } from "../../services/VersionService";
import { GroupService } from "../../services/GroupService";
import { ProblemsService } from "../../services/ProblemsService";
import FileTreeView from "../files/FileTreeView";
import { ProblemSetService } from "../../services/ProblemSetService";
import { HeadLink } from "../../models/Folder";

const useStyles = makeStyles(() => ({
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
    current: HeadLink | null;
}

export interface IPermissionsTabProps {
    permissionsService: PermissionsService;
    userService: UserService;
    versionService: VersionService;
    foldersService: FoldersService;
    groupService: GroupService;
    problemsService: ProblemsService;
    problemSetService: ProblemSetService;
}

export default function PermissionsTab(props: IPermissionsTabProps) {

    const [ state, setState ] = React.useState<IState>({
        current: null,
    });

    const changeCurrent = (current: HeadLink | null) => {
        setState({
            ...state,
            current: current
        });
    };

    useEffect(() => {
        return () => {
        }
    });

    const classes = useStyles();

    const permissionsView = state.current ? (
        <PermissionsView
            userService={props.userService}
            groupService={props.groupService}
            permissionsService={props.permissionsService}
            protectedItem={{ id: state.current.id, type: "head"}}
            title={state.current.name}
            />
    ) : null;

    return (
        <Grid container className={classes.root}>
            <Grid item className={classes.tree}>
                <FileTreeView
                    hideToolbar={true}
                    versionService={props.versionService}
                    foldersService={props.foldersService}
                    problemsService={props.problemsService}
                    problemSetService={props.problemSetService}
                    userService={props.userService}
                    selected={state.current}
                    onSelect={changeCurrent} />
            </Grid>
            <Grid item className={classes.content}>
                {permissionsView}
            </Grid>
        </Grid>
    );
};