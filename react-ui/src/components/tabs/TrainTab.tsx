import { makeStyles, Grid } from "@material-ui/core";
import React from "react";
import { VersionService } from "../../services/VersionService";
import { FoldersService } from "../../services/FoldersService";
import { ProblemsService } from "../../services/ProblemsService";
import { ProblemSetService } from "../../services/ProblemSetService";
import { FileExplorerState } from "../../states/FileExplorerState";
import ExplorerView from "../files/ExplorerView";

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

export interface ITrainTabProps {
    versionService: VersionService;
    foldersService: FoldersService;
    problemsService: ProblemsService;
    problemSetService: ProblemSetService;
}

export default function TrainTab(props: ITrainTabProps) {

    const [ fileExplorerState ] = React.useState(new FileExplorerState(props.foldersService));

    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <Grid item className={classes.tree}>
                <ExplorerView
                    filter={["problem_set"]}
                    versionService={props.versionService}
                    foldersService={props.foldersService}
                    state={fileExplorerState} />
            </Grid>
            <Grid item className={classes.content}>
                
            </Grid>
        </Grid>
    );
};