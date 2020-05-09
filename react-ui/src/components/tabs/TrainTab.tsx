import { makeStyles, Grid, Box } from "@material-ui/core";
import React from "react";
import { ExaminationService } from "../../services/ExaminationService";
import ProblemSetsListView from "../train/ProblemSetsListView";
import SubmissionsListView from "../train/SubmissionsListView";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
    problemSets: {
        width: "50%",
        height: "100%"
    },
    submissions: {
        width: "50%",
        height: "100%"
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
            <Grid item className={classes.problemSets}>
                <Box className={classes.list}>
                    <ProblemSetsListView
                        examinationService={props.examinationService}
                        />
                </Box>
            </Grid>
            <Grid item className={classes.submissions}>
                <Box className={classes.list}>
                    <SubmissionsListView
                        examinationService={props.examinationService}
                        />
                </Box>
            </Grid>
        </Grid>
    );
};