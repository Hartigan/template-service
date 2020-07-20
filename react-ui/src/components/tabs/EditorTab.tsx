import { makeStyles, Grid } from "@material-ui/core";
import React from "react";
import { VersionService } from "../../services/VersionService";
import { FoldersService } from "../../services/FoldersService";
import { ProblemsService } from "../../services/ProblemsService";
import { ProblemSetService } from "../../services/ProblemSetService";
import FileTreeView from "../files/FileTreeView";
import FilePreview from "../files/FilePreview";
import { UserService } from "../../services/UserService";
import { PermissionsService } from "../../services/PermissionsService";
import { HeadLink } from "../../models/Folder";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
    tree: {
        minWidth: "320px",
        width: "30%",
        height: "100%",
    },
    content: {
        width: "70%",
        height: "100%",
    },
}));

interface IState {
    selectedHead: HeadLink | null;
}

export interface IEditorTabProps {
    versionService: VersionService;
    foldersService: FoldersService;
    problemsService: ProblemsService;
    problemSetService: ProblemSetService;
    userService: UserService;
    permissionsService: PermissionsService;
}

export default function EditorTab(props: IEditorTabProps) {

    const [ state, setState ] = React.useState<IState>({
        selectedHead: null
    });

    const onSelectHead = (head: HeadLink) => {
        setState({
            ...state,
            selectedHead: head
        });
    };

    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <Grid item className={classes.tree}>
                <FileTreeView
                    versionService={props.versionService}
                    foldersService={props.foldersService}
                    problemsService={props.problemsService}
                    problemSetService={props.problemSetService}
                    userService={props.userService}
                    selected={state.selectedHead}
                    onSelect={onSelectHead}
                    />
            </Grid>
            <Grid item className={classes.content}>
                <FilePreview
                    current={state.selectedHead}
                    problemsService={props.problemsService}
                    foldersService={props.foldersService}
                    problemSetService={props.problemSetService}
                    permissionsService={props.permissionsService}
                    versionService={props.versionService} />
            </Grid>
        </Grid>
    );
};