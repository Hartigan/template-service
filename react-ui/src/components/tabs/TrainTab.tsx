import { makeStyles, Grid, Box, Paper, Switch, Typography, Toolbar } from "@material-ui/core";
import React from "react";
import { ExaminationService } from "../../services/ExaminationService";
import ProblemSetsListView from "../train/ProblemSetsListView";
import SubmissionsListView from "../train/SubmissionsListView";
import { SubmissionId, UserId } from "../../models/Identificators";
import { Submission } from "../../models/Submission";
import SubmissionDialog from "../train/SubmissionDialog";
import { Head } from "../../models/Head";
import { Report } from "../../models/Report";
import TagsEditorView from "../utils/TagsEditorView";
import SearchField from "../common/SearchField";
import { SearchNavigationView } from "../common/SearchNavigationView";
import { SearchInterval } from "../../models/SearchInterval";
import SearchIntervalView from "../common/SearchIntervalView";
import UserSearchView from "../common/UserSearchView";
import { UserService } from "../../services/UserService";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
    problemSets: {
        width: "100%",
    },
    problemSetsSearch: {
        width: "50%",
        margin: "auto",
        display: "flex",
        minWidth: "320px",
        maxWidth: "480px",
    },
    submissions: {
        width: "100%",
    },
    list: {
        margin: "auto",
        padding: "10px 0px 10px 0px",
        width: "80%"
    },
    searchNavigation: {
        margin: "auto",
        width: "auto"
    },
    searchTitle: {
        flexGrow: 1,
        fontSize: 14,
    },
    searchPaper: {
        flexGrow: 1,
        padding: "12px",
    },
    searchToolbar: {
        flexGrow: 1,
    },
    searchField: {
        width: "100%"
    },
}));

interface IState {
    submission: Submission | null;
    report: Report | null;
    submissionsIds: Array<SubmissionId> | null;
    problemSets: Array<Head> | null;
    searchIsPublic: boolean;
    searchString: string; 
    advancedSearch: boolean;
    searchTags: Array<string>;
    searchAuthorId: UserId | null;
    searchProblemsCount: SearchInterval<number> | null;
    searchDuration: SearchInterval<number> | null;
    searchPage: number;
    searchLimit: number;
};

export interface ITrainTabProps {
    examinationService: ExaminationService;
    userService: UserService;
}

export default function TrainTab(props: ITrainTabProps) {

    const [ state, setState ] = React.useState<IState>({
        submission: null,
        submissionsIds: null,
        problemSets: null,
        report: null,
        searchTags: [],
        searchAuthorId: null,
        searchProblemsCount: null,
        searchDuration: null,
        searchString: "",
        searchPage: 1,
        searchLimit: 10,
        searchIsPublic: true,
        advancedSearch: false
    });

    const fetchData = async () => {
        let problemSets = state.problemSets;
        let submissionsIds = state.submissionsIds;
        if (problemSets === null) {
            problemSets = await props.examinationService.getProblemSets(
                state.searchIsPublic,
                state.searchString,
                state.searchTags,
                state.searchAuthorId,
                state.searchProblemsCount,
                state.searchDuration ? { from: state.searchDuration.from * 60, to: state.searchDuration.to * 60 } : null,
                (state.searchPage - 1) * state.searchLimit,
                state.searchLimit
            );
        }

        if (submissionsIds === null) {
            submissionsIds = await props.examinationService.getSubmissions();
        }

        return {
            problemSets: problemSets,
            submissionsIds: submissionsIds
        };
    }

    React.useEffect(() => {
        if (state.submissionsIds === null || state.problemSets === null) {
            let canUpdate = true;

            fetchData().then(data => {
                if (canUpdate) {
                    setState({
                        ...state,
                        ...data
                    });
                }
            });

            return () => {
                canUpdate = false;
            };
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

    const onIsPublicChanged = (value: boolean) => {
        setState({
            ...state,
            problemSets: null,
            searchIsPublic: value
        });
    };

    const onAdvancedSearchChanged = (value: boolean) => {
        setState({
            ...state,
            advancedSearch: value
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

    const onDurationInterval = (value: SearchInterval<number> | null) => {
        setState({
            ...state,
            searchDuration: value,
            problemSets: null
        })
    };

    const onProblemsCountInterval = (value: SearchInterval<number> | null) => {
        setState({
            ...state,
            searchProblemsCount: value,
            problemSets: null
        })
    };

    const onAuthorSelected = (value: UserId | null) => {
        setState({
            ...state,
            searchAuthorId: value,
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
            <Grid item className={classes.problemSetsSearch}>
                <Paper className={classes.searchPaper}>
                    <Toolbar className={classes.searchToolbar}>
                        <Typography className={classes.searchTitle} color="textSecondary" gutterBottom>
                            Is public
                        </Typography>
                        <Switch
                            checked={state.searchIsPublic}
                            onChange={(_, value) => onIsPublicChanged(value)}
                            color="primary"
                            />
                    </Toolbar>
                    <Toolbar className={classes.searchToolbar}>
                        <SearchField
                            className={classes.searchField}
                            placeholder="title..."
                            color="primary"
                            onSearch={(v) => onSearchUpdated(v)}
                            />
                    </Toolbar>
                    <Toolbar className={classes.searchToolbar}>
                        <Typography className={classes.searchTitle} color="textSecondary" gutterBottom>
                            Advanced search
                        </Typography>
                        <Switch
                            checked={state.advancedSearch}
                            onChange={(_, value) => onAdvancedSearchChanged(value)}
                            color="primary"
                            />
                    </Toolbar>
                    <Box hidden={!state.advancedSearch}>
                        <SearchIntervalView
                            label="Duration"
                            interval={state.searchDuration}
                            defaultInterval={{from: 5, to: 10 }}
                            maxInterval={{from: 0, to: 120 }}
                            onChanged={onDurationInterval}
                            />
                        <SearchIntervalView
                            label="Problems count"
                            interval={state.searchProblemsCount}
                            defaultInterval={{from: 5, to: 10 }}
                            maxInterval={{from: 0, to: 50 }}
                            onChanged={onProblemsCountInterval}
                            />
                        <Toolbar className={classes.searchToolbar}>
                            <Typography className={classes.searchTitle} color="textSecondary" gutterBottom>
                                Author
                            </Typography>
                        </Toolbar>
                        <UserSearchView
                            userService={props.userService}
                            onUserSelected={onAuthorSelected}
                            />
                        <TagsEditorView
                            tags={state.searchTags}
                            onAdd={onAddSearchTag}
                            onRemove={onRemoveSearchTag}
                            />
                    </Box>
                </Paper>
            </Grid>
            <Grid item className={classes.problemSets}>
                <Box className={classes.list}>
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