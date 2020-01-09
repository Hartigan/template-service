import { makeStyles, Dialog, TextField, Button, AppBar, Toolbar, IconButton, Typography, List, ListItem, FormControl, Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import { FoldersService } from "../../services/FoldersService";
import { FileExplorerState } from "../../states/FileExplorerState";
import { ProblemsService } from "../../services/ProblemsService";
import { ProblemSetService } from "../../services/ProblemSetService";
import CloseIcon from '@material-ui/icons/Close';
import { HeadLink, fromHead } from "../../models/Folder";
import ExplorerView from "../files/ExplorerView";
import { VersionService } from "../../services/VersionService";
import ProblemPreview from "./ProblemPreview";
import { isNullOrUndefined } from "util";
import ProblemsListView from "./ProblemsListView";
import DurationInput from "./DurationInput";
import { ProblemSet } from "../../models/ProblemSet";
import { Problem } from "../../models/Problem";
import { Head } from "../../models/Head";
import { Commit } from "../../models/Commit";

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    container: {
        margin: 0,
        width: "100%",
    },
    sourceContainer: {
        width: "50%",
    },
    source: {
        width: "30%",
    },
    sourcePreview: {
        width: "70%",
    },
    listContainer: {
        width: "50%",
    },
    list: {
        width: "30%",
    },
    listPreview: {
        width: "70%",
    },
    formList: {
        width: '100%',
    },
    form: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

interface IPreviewData {
    head: Head;
    problem: Problem;
}

interface IProblemsList {
    problems: Array<HeadLink>;
    selected: number | null;
}

interface IState {
    problemSet: ProblemSet;
    commitDescription: string;
    treeState: FileExplorerState;
    treePreview: IPreviewData | null;
    problemsList: IProblemsList;
    problemsListPreview: IPreviewData | null;
}

export interface IEditProblemSetDialogProps {
    open: boolean;
    commit: Commit;
    onClose: () => void;
    versionService: VersionService;
    foldersService: FoldersService;
    problemsService: ProblemsService;
    problemSetService: ProblemSetService;
    fileExplorerState: FileExplorerState;
}

export default function EditProblemSetDialog(props: IEditProblemSetDialogProps) {
    const [ state, setState ] = React.useState<IState | null>(null);

    const clean = () => {
        setState(null);
    };

    const sync = async (commit: Commit) => {
        const problemSet = await props.problemSetService.get(commit.id);
        const heads = await Promise.all(
                problemSet.head_ids
                    .map(headId => props.versionService.getHead(headId))
            );
        const headLinks = heads.map(fromHead);
        setState({
            problemSet: problemSet,
            commitDescription: "",
            treeState: new FileExplorerState(props.foldersService),
            treePreview: null,
            problemsList: {
                problems: headLinks,
                selected: null
            },
            problemsListPreview: null
        });
    };

    useEffect(() => {
        if (!state) {
            if (props.open) {
                sync(props.commit);
            }
            return;
        }

        const headChangedSub = state.treeState
            .currentHeadChanged()
            .subscribe(async link => {
                if (!link) {
                    return;
                }

                const head = await props.versionService.getHead(link.id);
                const problem = await props.problemsService.get(head.commit.id);
                if (state) {
                    setState({
                        ...state,
                        treePreview: {
                            head: head,
                            problem: problem,
                        }
                    });
                }
            });

        return () => {
            headChangedSub.unsubscribe();
        };
    });

    const onAdd = () => {
        if (state && state.treePreview) {
            setState({
                ...state,
                problemSet: {
                    ...state.problemSet,
                    head_ids: state.problemSet.head_ids.concat([ state.treePreview.head.id ]),
                },
                problemsList: {
                    ...state.problemsList,
                    problems: state.problemsList.problems.concat([ fromHead(state.treePreview.head) ])
                }
            });
        }
    };

    const onRemove = () => {
        if (state && state.problemsList.selected) {
            setState({
                ...state,
                problemSet: {
                    ...state.problemSet,
                    head_ids: state.problemSet.head_ids.filter((_, i) => i !== state.problemsList.selected),
                },
                problemsList: {
                    ...state.problemsList,
                    problems: state.problemsList.problems.filter((_, i) => i !== state.problemsList.selected),
                    selected: null,
                },
                problemsListPreview: null,
            });
        }
    };

    const onSelectInList = async (index: number) => {
        if (!state) {
            return;
        }

        const link = state.problemsList.problems[index];
        const head = await props.versionService.getHead(link.id);
        const problem = await props.problemsService.get(head.commit.id);

        if (!state) {
            return;
        }

        setState({
            ...state,
            problemsList: {
                ...state.problemsList,
                selected: index,
            },
            problemsListPreview: {
                head: head,
                problem: problem,
            },
        });
    };

    const onCancel = () => {
        clean();
        props.onClose();
    };

    const onSave = async () => {
        if (!state) {
            return;
        }

        await props.problemSetService.update(props.commit.head_id, state.commitDescription, state.problemSet);

        clean();
        props.onClose();
        props.fileExplorerState.syncHead(props.commit.head_id);
    };

    const setTitle = (title: string) => {
        if (state) {
            setState({
                ...state,
                problemSet: {
                    ...state.problemSet,
                    title: title,
                },
            });
        }
    };

    const setDuration = (mins: number) => {
        if (state) {
            setState({
                ...state,
                problemSet: {
                    ...state.problemSet,
                    duration: mins * 60,
                },
            });
        }
    };

    const setCommitDescription = (desc: string) => {
        if (state) {
            setState({
                ...state,
                commitDescription: desc,
            });
        }
    };

    const classes = useStyles();

    if (!state) {
        return (<div/>);
    }

    const treePreviewView = state.treePreview ? (
        <ProblemPreview
            problem={state.treePreview.problem} />
    ) : null;

    const listPreviewView = state.problemsListPreview ? (
        <ProblemPreview
            problem={state.problemsListPreview.problem} />
    ) : null;

    return (
        <Dialog
            open={props.open}
            fullScreen>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="close"
                        onClick={onCancel}>
                        <CloseIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Problem set
                    </Typography>
                    <Button
                        autoFocus
                        color="inherit"
                        onClick={onSave}>
                        Save
                    </Button>
                </Toolbar>
            </AppBar>
            <List
                className={classes.formList}>
                <ListItem>
                    <FormControl className={classes.form}>
                        <TextField
                            label="Commit description"
                            value={state.commitDescription}
                            onChange={(e) => setCommitDescription(e.target.value)} />
                    </FormControl>
                </ListItem>
                <ListItem>
                    <FormControl className={classes.form}>
                        <TextField
                            label="Title"
                            value={state.problemSet.title}
                            onChange={(e) => setTitle(e.target.value)} />
                    </FormControl>
                </ListItem>
                <ListItem>
                    <FormControl className={classes.form}>
                        <DurationInput
                            value={state.problemSet.duration / 60}
                            onChange={(mins) => setDuration(mins)}
                            step={1}
                            max={120} />
                    </FormControl>
                </ListItem>
            </List>
            <Grid container className={classes.container}>
                <Grid item className={classes.sourceContainer}>
                    <Grid container className={classes.container}>
                        <Grid item className={classes.source}>
                            <ExplorerView
                                foldersService={props.foldersService}
                                state={state.treeState}
                                filter={["problem"]}
                                versionService={props.versionService} />
                        </Grid>
                        <Grid item className={classes.sourcePreview}>
                            <Button
                                disabled={isNullOrUndefined(state.treePreview)}
                                onClick={onAdd}>
                                Add
                            </Button>
                            {treePreviewView}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item className={classes.listContainer}>
                    <Grid container className={classes.container}>
                        <Grid item className={classes.list}>
                            <ProblemsListView
                                links={state.problemsList.problems}
                                onSelect={(index) => onSelectInList(index)} />
                        </Grid>
                        <Grid item className={classes.listPreview}>
                            <Button
                                disabled={isNullOrUndefined(state.problemsListPreview)}
                                onClick={onRemove}>
                                Remove
                            </Button>
                            {listPreviewView}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Dialog>
    );
};