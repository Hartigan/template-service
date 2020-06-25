import { makeStyles, Grid, Box } from "@material-ui/core";
import React from "react";
import { ExaminationService } from "../../services/ExaminationService";
import ProblemSetsListView from "../train/ProblemSetsListView";
import SubmissionsListView from "../train/SubmissionsListView";
import { SubmissionId } from "../../models/Identificators";
import { Submission } from "../../models/Submission";
import SubmissionDialog from "../train/SubmissionDialog";
import { Head } from "../../models/Head";
import { Report } from "../../models/Report";
import TagsEditorView from "../utils/TagsEditorView";
import SearchField from "../common/SearchField";
import { SearchNavigationView } from "../common/SearchNavigationView";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
    problemSets: {
        width: "100%",
    },
    submissions: {
        width: "100%",
    },
    list: {
        margin: "auto",
        padding: "10px 0px 10px 0px",
        width: "60%"
    },
    searchNavigation: {
        margin: "auto",
        width: "auto"
    },
}));

interface IState {
    submission: Submission | null;
    report: Report | null;
    submissionsIds: Array<SubmissionId> | null;
    problemSets: Array<Head> | null;
    searchString: string; 
    searchTags: Array<string>;
    searchPage: number;
    searchLimit: number;
};

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
        searchString: "",
        searchPage: 1,
        searchLimit: 10
    });

    const fetchProblemSets = async () => {
        let problemSets = await props.examinationService.getProblemSets(
            state.searchString,
            state.searchTags,
            (state.searchPage - 1) * state.searchLimit,
            state.searchLimit
        );
        setState({
            ...state,
            problemSets: problemSets,
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

    const onPageChanged = (page: number) => {
        setState({
            ...state,
            problemSets: null,
            searchPage: page
        });
    };

    const onLimitChanged = (limit: number) => {
        setState({
            ...state,
            problemSets: null,
            searchLimit: limit
        });
    };

    const onShowSubmission = async (submissionId: SubmissionId) => {
        let submission = await props.examinationService.getSubmission(submissionId);
        setState({
            ...state,
            submission: submission
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

    const getSubmissionsList = () => {
        if (state.submissionsIds && state.submissionsIds.length > 0) {
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

    const onSearchUpdated = (value: string) => {
        setState({
            ...state,
            searchString: value,
            problemSets: null
        })
    };

    return (
        <Grid container className={classes.root}>
            {getSubmissionDialog()}
            <Grid item className={classes.submissions}>
                <Box className={classes.list}>
                    {getSubmissionsList()}
                </Box>
            </Grid>
            <Grid item className={classes.problemSets}>
                <Box className={classes.list}>
                    <TagsEditorView
                        tags={state.searchTags}
                        onAdd={onAddSearchTag}
                        onRemove={onRemoveSearchTag}
                        />
                    <SearchField
                        placeholder="search..."
                        color="primary"
                        onSearch={(v) => onSearchUpdated(v)}
                        />
                    <SearchNavigationView
                        className={classes.searchNavigation}
                        page={state.searchPage}
                        size={state.searchLimit}
                        onPageChanged={onPageChanged}
                        onSizeChanged={onLimitChanged}
                        />
                    <ProblemSetsListView
                        examinationService={props.examinationService}
                        onShowSubmission={onShowSubmission}
                        problemSets={state.problemSets ? state.problemSets : []}
                        />
                </Box>
            </Grid>
        </Grid>
    );
};