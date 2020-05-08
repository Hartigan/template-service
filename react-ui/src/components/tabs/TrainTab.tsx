import { makeStyles, Grid, Box } from "@material-ui/core";
import React from "react";
import { FileExplorerState } from "../../states/FileExplorerState";
import ExplorerView from "../files/ExplorerView";
import { ExaminationService } from "../../services/ExaminationService";
import { CommitId, HeadId } from "../../models/Identificators";
import { Head } from "../../models/Head";
import ProblemSetsListView from "../train/ProblemSetsListView";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
    list: {
        margin: "auto",
        width: "60%"
    }
}));

interface IState {
}

export interface ITrainTabProps {
    examinationService: ExaminationService;
}

export default function TrainTab(props: ITrainTabProps) {

    const [ state, setState ] = React.useState<IState>({
    });

    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <Box className={classes.list}>
                <ProblemSetsListView
                    examinationService={props.examinationService}
                    />
            </Box>
        </Grid>
    );
};