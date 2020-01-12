import { makeStyles, Grid } from "@material-ui/core";
import React from "react";
import { VersionService } from "../../services/VersionService";
import { FoldersService } from "../../services/FoldersService";
import { ProblemsService } from "../../services/ProblemsService";
import { ProblemSetService } from "../../services/ProblemSetService";
import { FileExplorerState } from "../../states/FileExplorerState";
import FileTreeView from "../files/FileTreeView";
import FilePreview from "../files/FilePreview";

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

export interface IEditorTabProps {
    versionService: VersionService;
    foldersService: FoldersService;
    problemsService: ProblemsService;
    problemSetService: ProblemSetService;
}

export default function EditorTab(props: IEditorTabProps) {

    const [ fileExplorerState ] = React.useState(new FileExplorerState(props.foldersService));

    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <Grid item className={classes.tree}>
                <FileTreeView
                    versionService={props.versionService}
                    foldersService={props.foldersService}
                    problemsService={props.problemsService}
                    problemSetService={props.problemSetService}
                    state={fileExplorerState} />
            </Grid>
            <Grid item className={classes.content}>
                <FilePreview
                    fileExplorerState={fileExplorerState}
                    problemsService={props.problemsService}
                    foldersService={props.foldersService}
                    problemSetService={props.problemSetService}
                    versionService={props.versionService} />
            </Grid>
        </Grid>
    );
};