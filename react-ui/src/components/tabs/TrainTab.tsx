import { makeStyles, Grid, Box, TextField } from "@material-ui/core";
import React from "react";
import { ExaminationService } from "../../services/ExaminationService";
import ProblemSetsListView from "../train/ProblemSetsListView";
import SubmissionsListView from "../train/SubmissionsListView";
import { SubmissionId, ReportId } from "../../models/Identificators";
import { Submission } from "../../models/Submission";
import SubmissionDialog from "../train/SubmissionDialog";
import { Head } from "../../models/Head";
import { Report } from "../../models/Report";
import ReportDialog from "../common/ReportDialog";
import TagsEditorView from "../utils/TagsEditorView";

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
    report: Report | null;
    submissionsIds: Array<SubmissionId> | null;
    problemSets: Array<Head> | null;
    search : {
        value: string;
        filtered: Array<Head>;
    }
    searchTags: Array<string>;
}

export interface ITrainTabProps {
    examinationService: ExaminationService;
}

export default function TrainTab(props: ITrainTabProps) {

    const [ state, setState ] = React.useState<IState>({
        submission: null,
        submissionsIds: null,
        problemSets: null,
        report: null,
        searchTags: [],
        search: {
            value: "",
            filtered: []
        }
    });

    const fetchProblemSets = async () => {
        let problemSets = await props.examinationService.getProblemSets(state.searchTags);
        setState({
            ...state,
            problemSets: problemSets,
            search: {
                ...state.search,
                filtered: state.search.value
                    ? problemSets.filter(head => head.name.toLowerCase().includes(state.search.value))
                    : problemSets
            }
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

    const onShowReport = async (reportId: ReportId) => {
        let report = await props.examinationService.getReport(reportId);
        setState({
            ...state,
            report: report
        });
    };

    const onAddSearchTag = async (tag: string) => {
        if (tag) {
            setState({
                ...state,
                problemSets: null,
                searchTags: [...state.searchTags, tag]
            })
        }
    };

    const onRemoveSearchTag = async (tag: string) => {
        setState({
            ...state,
            problemSets: null,
            searchTags: state.searchTags.filter(x => x !== tag)
        })
    };

    const onCloseDialog = () => {
        setState({
            ...state,
            submissionsIds: null,
            problemSets: null,
            submission: null,
            report: null
        })
    };

    const getSubmissionDialog = () => {
        if (state.submission) {
            return <SubmissionDialog
                        open={true}
                        onClose={onCloseDialog}
                        submission={state.submission}
                        examinationService={props.examinationService}
                        />;
        }
        else {
            return <div/>;
        }
    };

    const getReportDialog = () => {
        if (state.report) {
            return <ReportDialog
                        open={true}
                        onClose={onCloseDialog}
                        report={state.report}
                        />;
        }
        else {
            return <div/>;
        }
    };


    const getSubmissionsList = () => {
        if (state.submissionsIds) {
            return (
                <SubmissionsListView
                    examinationService={props.examinationService}
                    submissionsIds={state.submissionsIds}
                    onShowSubmission={onShowSubmission}
                    onShowReport={onShowReport}
                    />
            );
        }
        else {
            return <div/>;
        }
    };

    const onSearchUpdated = (value: string) => {
        if (state.problemSets === null) {
            return;
        }

        setState({
            ...state,
            search: {
                value: value,
                filtered: value
                    ? state.problemSets.filter(head => head.name.toLowerCase().includes(value))
                    : state.problemSets
            }
        })
    };

    return (
        <Grid container className={classes.root}>
            {getSubmissionDialog()}
            {getReportDialog()}
            <Grid item className={classes.problemSets}>
                <Box className={classes.list}>
                    <TagsEditorView
                        tags={state.searchTags}
                        onAdd={onAddSearchTag}
                        onRemove={onRemoveSearchTag}
                        />
                    <TextField
                        placeholder="search..."
                        color="primary"
                        value={state.search.value}
                        onChange={(e) => onSearchUpdated(e.target.value)}
                        />
                    <ProblemSetsListView
                        examinationService={props.examinationService}
                        onShowSubmission={onShowSubmission}
                        problemSets={state.search.filtered}
                        />
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