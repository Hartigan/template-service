import { makeStyles, Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import { PermissionsService, Protected } from "../../services/PermissionsService";
import { UserService } from "../../services/UserService";
import { FileExplorerState } from "../../states/FileExplorerState";
import { FoldersService } from "../../services/FoldersService";
import ExplorerView from "../files/ExplorerView";
import PermissionsView from "../groups/PermissionsView";
import { VersionService } from "../../services/VersionService";
import { GroupService } from "../../services/GroupService";

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
    current: Protected | null;
    tree: FileExplorerState;
}

export interface IPermissionsTabProps {
    permissionsService: PermissionsService;
    userService: UserService;
    versionService: VersionService;
    foldersService: FoldersService;
    groupService: GroupService;
}

export default function PermissionsTab(props: IPermissionsTabProps) {

    const [ state, setState ] = React.useState<IState>({
        current: null,
        tree: new FileExplorerState(props.foldersService)
    });

    const changeCurrent = (current: Protected) => {
        setState({
            ...state,
            current: current
        });
    };

    useEffect(() => {
        let protectedSub = state.tree
            .currentProtectedChanged()
            .subscribe(changeCurrent);
        return () => {
            protectedSub.unsubscribe();
        }
    });

    const classes = useStyles();

    const permissionsView = state.current ? (
        <PermissionsView
            userService={props.userService}
            groupService={props.groupService}
            permissionsService={props.permissionsService}
            protectedItem={state.current}
            />
    ) : null;

    return (
        <Grid container className={classes.root}>
            <Grid item className={classes.tree}>
                <ExplorerView
                    versionService={props.versionService}
                    foldersService={props.foldersService}
                    state={state.tree} />
            </Grid>
            <Grid item className={classes.content}>
                {permissionsView}
            </Grid>
        </Grid>
    );
};