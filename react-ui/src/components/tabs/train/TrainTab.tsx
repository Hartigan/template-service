import { makeStyles, Grid, Box, Paper, Switch, Typography, Toolbar } from "@material-ui/core";
import React from "react";
import ProblemSetsListView from "../../train/ProblemSetsListView";
import SubmissionsListView from "../../train/SubmissionsListView";
import { SubmissionId, UserId } from "../../../models/Identificators";
import { Submission } from "../../../models/Submission";
import SubmissionDialog from "../../train/SubmissionDialog";
import { Head } from "../../../models/Head";
import TagsEditorView from "../../utils/TagsEditorView";
import SearchField from "../../common/SearchField";
import { SearchNavigationView } from "../../common/SearchNavigationView";
import { SearchInterval } from "../../../models/SearchInterval";
import SearchIntervalView from "../../common/SearchIntervalView";
import UserSearchView from "../../common/UserSearchView";
import { useDispatch } from 'react-redux';
import { closeSubmission, fetchProblemSets, fetchSubmissions, openSubmission, startSubmission, updateAdvanced, updateAuthor, updateIsPublic, updateLimit, updatePage, updatePattern, updateProblemsCount, updateProblemsDuration, updateTags } from "./TrainTabSlice";
import { ProblemSetPreview } from "../../../models/ProblemSetPreview";

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


export interface ITrainTabProps {
    submissions: {
        data: Array<SubmissionId>;
        loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    };
    problemSets: {
        data: Array<{ head: Head; preview: ProblemSetPreview; }>;
        loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    }    
    search: {
        authorId: UserId | null;
        isPublic: boolean;
        tags: Array<string>;
        pattern: string;
        advanced: boolean;
        problemsCount: SearchInterval<number> | null;
        problemsDuration: SearchInterval<number> | null;
        page: number;
        limit: number;
    },
    submission: { open: false; } | { open: true; data: Submission; };
};

export default function TrainTab(props: ITrainTabProps) {

    const dispatch = useDispatch();

    React.useEffect(() => {
        if (props.problemSets.loading === 'idle') {
            dispatch(fetchProblemSets({
                isPublic: props.search.isPublic,
                pattern: props.search.pattern,
                tags: props.search.tags,
                authorId: props.search.authorId,
                problemsCount: props.search.problemsCount,
                duration: props.search.problemsDuration ? { from: props.search.problemsDuration.from * 60, to: props.search.problemsDuration.to * 60 } : null,
                offset: (props.search.page - 1) * props.search.limit,
                limit: props.search.limit
            }));
        }

        if (props.submissions.loading === 'idle') {
            dispatch(fetchSubmissions());
        }
    });

    const classes = useStyles();

    const onAddSearchTag = async (tag: string) => {
        if (tag) {
            dispatch(updateTags([...props.search.tags, tag]));
        }
    };

    const onRemoveSearchTag = async (tag: string) => {
        dispatch(updateTags(props.search.tags.filter(x => x !== tag)));
    };

    const getSubmissionDialog = () => {
        if (props.submission.open) {
            return <SubmissionDialog
                        open={props.submission.open}
                        onClose={() => dispatch(closeSubmission())}
                        submission={props.submission.data}
                        />;
        }
        else {
            return <div/>;
        }
    };

    return (
        <Grid container className={classes.root}>
            {getSubmissionDialog()}
            <Grid item className={classes.submissions}>
                <Box className={classes.list}>
                    <SubmissionsListView
                        submissionsIds={props.submissions.data}
                        onShowSubmission={(submissionId) => dispatch(openSubmission(submissionId))}
                        />
                </Box>
            </Grid>
            <Grid item className={classes.problemSetsSearch}>
                <Paper className={classes.searchPaper}>
                    <Toolbar className={classes.searchToolbar}>
                        <Typography className={classes.searchTitle} color="textSecondary" gutterBottom>
                            Is public
                        </Typography>
                        <Switch
                            checked={props.search.isPublic}
                            onChange={(_, value) => dispatch(updateIsPublic(value))}
                            color="primary"
                            />
                    </Toolbar>
                    <Toolbar className={classes.searchToolbar}>
                        <SearchField
                            className={classes.searchField}
                            placeholder="title..."
                            color="primary"
                            onSearch={(v) => dispatch(updatePattern(v))}
                            />
                    </Toolbar>
                    <Toolbar className={classes.searchToolbar}>
                        <Typography className={classes.searchTitle} color="textSecondary" gutterBottom>
                            Advanced search
                        </Typography>
                        <Switch
                            checked={props.search.advanced}
                            onChange={(_, value) => dispatch(updateAdvanced(value))}
                            color="primary"
                            />
                    </Toolbar>
                    <Box hidden={!props.search.advanced}>
                        <SearchIntervalView
                            label="Duration"
                            interval={props.search.problemsDuration}
                            defaultInterval={{from: 5, to: 10 }}
                            maxInterval={{from: 0, to: 120 }}
                            onChanged={(v) => dispatch(updateProblemsDuration(v))}
                            />
                        <SearchIntervalView
                            label="Problems count"
                            interval={props.search.problemsCount}
                            defaultInterval={{from: 5, to: 10 }}
                            maxInterval={{from: 0, to: 50 }}
                            onChanged={(v) => dispatch(updateProblemsCount(v))}
                            />
                        <Toolbar className={classes.searchToolbar}>
                            <Typography className={classes.searchTitle} color="textSecondary" gutterBottom>
                                Author
                            </Typography>
                        </Toolbar>
                        <UserSearchView
                            onUserSelected={(v) => dispatch(updateAuthor(v))}
                            />
                        <TagsEditorView
                            tags={props.search.tags}
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
                        page={props.search.page}
                        size={props.search.limit}
                        onPageChanged={(v) => dispatch(updatePage(v))}
                        onSizeChanged={(v) => dispatch(updateLimit(v))}
                        />
                    <ProblemSetsListView
                        onStartSubmission={(headId) => dispatch(startSubmission(headId))}
                        problemSets={props.problemSets.data}
                        />
                </Box>
            </Grid>
        </Grid>
    );
};