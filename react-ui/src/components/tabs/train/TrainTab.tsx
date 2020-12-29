import { makeStyles, Grid, Box, Paper, Switch, Typography, Toolbar } from "@material-ui/core";
import React from "react";
import ProblemSetsListView from "../../train/ProblemSetsListView";
import SubmissionsListView from "../../train/SubmissionsListView";
import { HeadId, SubmissionId, UserId } from "../../../models/Identificators";
import { Submission } from "../../../models/Submission";
import SubmissionDialog from "../../train/SubmissionDialog";
import { Head } from "../../../models/Head";
import TagsEditorView from "../../utils/TagsEditorView";
import SearchField from "../../common/SearchField";
import { SearchNavigationView } from "../../common/SearchNavigationView";
import { SearchInterval } from "../../../models/SearchInterval";
import SearchIntervalView from "../../common/SearchIntervalView";
import UserSearchView from "../../common/UserSearchView";
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


export interface ITrainTabParameters {
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
}

export interface ITrainTabActions {
    fetchSubmissions(): void;
    openSubmission(id: SubmissionId): void;
    startSubmission(headId: HeadId): void;
    fetchProblemSets(params: {
        isPublic: boolean,
        pattern: string | null,
        tags: Array<string> | null,
        authorId: UserId | null,
        problemsCount: SearchInterval<number> | null,
        duration: SearchInterval<number> | null,
        offset: number,
        limit: number 
    }): void;
    updatePattern(pattern: string): void;
    updateAuthor(userId: UserId | null): void;
    updateIsPublic(isPublic: boolean): void;
    updateTags(tags: Array<string>): void;
    updateAdvanced(isAdvanced: boolean): void;
    updateProblemsCount(countInterval: SearchInterval<number> | null): void;
    updateDuration(durationInterval: SearchInterval<number> | null): void;
    updatePage(index: number): void;
    updateLimit(limit: number): void;
    closeSubmission(): void;
};

export interface ITrainTabProps extends ITrainTabParameters, ITrainTabActions {
};

export default function TrainTab(props: ITrainTabProps) {

    React.useEffect(() => {
        if (props.problemSets.loading === 'idle') {
            props.fetchProblemSets({
                isPublic: props.search.isPublic,
                pattern: props.search.pattern,
                tags: props.search.tags,
                authorId: props.search.authorId,
                problemsCount: props.search.problemsCount,
                duration: props.search.problemsDuration ? { from: props.search.problemsDuration.from * 60, to: props.search.problemsDuration.to * 60 } : null,
                offset: (props.search.page - 1) * props.search.limit,
                limit: props.search.limit
            });
        }

        if (props.submissions.loading === 'idle') {
            props.fetchSubmissions();
        }
    });

    const classes = useStyles();

    const onAddSearchTag = (tag: string) => {
        if (tag) {
            props.updateTags([...props.search.tags, tag]);
        }
    };

    const onRemoveSearchTag = (tag: string) => {
        props.updateTags(props.search.tags.filter(x => x !== tag));
    };

    const getSubmissionDialog = () => {
        if (props.submission.open) {
            return <SubmissionDialog
                        open={props.submission.open}
                        onClose={() => {
                            props.closeSubmission();
                            props.fetchSubmissions();
                        }}
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
                        onShowSubmission={(submissionId) => props.openSubmission(submissionId)}
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
                            onChange={(_, value) => props.updateIsPublic(value)}
                            color="primary"
                            />
                    </Toolbar>
                    <Toolbar className={classes.searchToolbar}>
                        <SearchField
                            className={classes.searchField}
                            placeholder="title..."
                            color="primary"
                            onSearch={(v) => props.updatePattern(v)}
                            />
                    </Toolbar>
                    <Toolbar className={classes.searchToolbar}>
                        <Typography className={classes.searchTitle} color="textSecondary" gutterBottom>
                            Advanced search
                        </Typography>
                        <Switch
                            checked={props.search.advanced}
                            onChange={(_, value) => props.updateAdvanced(value)}
                            color="primary"
                            />
                    </Toolbar>
                    <Box hidden={!props.search.advanced}>
                        <SearchIntervalView
                            label="Duration"
                            interval={props.search.problemsDuration}
                            defaultInterval={{from: 5, to: 10 }}
                            maxInterval={{from: 0, to: 120 }}
                            onChanged={(v) => props.updateDuration(v)}
                            />
                        <SearchIntervalView
                            label="Problems count"
                            interval={props.search.problemsCount}
                            defaultInterval={{from: 5, to: 10 }}
                            maxInterval={{from: 0, to: 50 }}
                            onChanged={(v) => props.updateProblemsCount(v)}
                            />
                        <Toolbar className={classes.searchToolbar}>
                            <Typography className={classes.searchTitle} color="textSecondary" gutterBottom>
                                Author
                            </Typography>
                        </Toolbar>
                        <UserSearchView
                            onUserSelected={(v) => props.updateAuthor(v)}
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
                        onPageChanged={(v) => props.updatePage(v)}
                        onSizeChanged={(v) => props.updateLimit(v)}
                        />
                    <ProblemSetsListView
                        onStartSubmission={(headId) => props.startSubmission(headId)}
                        problemSets={props.problemSets.data}
                        />
                </Box>
            </Grid>
        </Grid>
    );
};