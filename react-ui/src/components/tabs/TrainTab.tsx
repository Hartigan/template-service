import { makeStyles, Grid, Box } from "@material-ui/core";
import React from "react";
import { ExaminationService } from "../../services/ExaminationService";
import ProblemSetsListView from "../train/ProblemSetsListView";
import SubmissionsListView from "../train/SubmissionsListView";
import { SubmissionId } from "../../models/Identificators";
import { Submission } from "../../models/Submission";
import SubmissionDialog from "../train/SubmissionDialog";
import { Head } from "../../models/Head";

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
    submission: Submission | null;
    submissionsIds: Array<SubmissionId> | null;
    problemSets: Array<Head> | null;
}

export interface ITrainTabProps {
    examinationService: ExaminationService;
}

export default function TrainTab(props: ITrainTabProps) {

    const [ state, setState ] = React.useState<IState>({
        submission: null,
        submissionsIds: null,
        problemSets: null
    });

    const fetchProblemSets = async () => {
        let problemSets = await props.examinationService.getProblemSets();
        setState({
            ...state,
            problemSets: problemSets
        });
    };

    const fetchSubmissionsIds = async () => {
        let submissionsIds = await props.examinationService.getSubmissions();
        setState({
            ...state,
            submissionsIds: submissionsIds
        });
    };

    React.useEffect(() => {
        if (state.submissionsIds === null) {
            fetchSubmissionsIds();
        }

        if (state.problemSets === null) {
            fetchProblemSets();
        }
    });

    const classes = useStyles();

    const onShowSubmission = async (submissionId: SubmissionId) => {
        let submission = await props.examinationService.getSubmission(submissionId);
        setState({
            ...state,
            submission: submission
        });
    };

    const onCloseSubmission = () => {
        setState({
            ...state,
            submissionsIds: null,
            problemSets: null,
            submission: null
        })
    };

    let submissionDialog = state.submission === null ? null : (
        <SubmissionDialog
            open={true}
            onClose={onCloseSubmission}
            submission={state.submission}
            examinationService={props.examinationService}
            />
    );

    const getSubmissionsList = () => {
        if (state.submissionsIds) {
            return (
                <SubmissionsListView
                    examinationService={props.examinationService}
                    submissionsIds={state.submissionsIds}
                    onShowSubmission={onShowSubmission}
                    />
            );
        }
        else {
            return <div/>;
        }
    };

    const getProblemSets = () => {
        if (state.problemSets) {
            return (
                <ProblemSetsListView
                    examinationService={props.examinationService}
                    onShowSubmission={onShowSubmission}
                    problemSets={state.problemSets}
                    />
            );
        }
        else {
            return <div/>;
        }
    };

    return (
        <Grid container className={classes.root}>
            {submissionDialog}
            <Grid item className={classes.problemSets}>
                <Box className={classes.list}>
                    {getProblemSets()}
                </Box>
            </Grid>
            <Grid item className={classes.submissions}>
                <Box className={classes.list}>
                    {getSubmissionsList()}
                </Box>
            </Grid>
        </Grid>
    );
};