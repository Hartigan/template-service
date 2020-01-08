import { makeStyles, Dialog, TextField, Button, AppBar, Toolbar, IconButton, Typography, List, ListItem, FormControl, Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import { FoldersService } from "../../services/FoldersService";
import { FileExplorerState } from "../../states/FileExplorerState";
import { ProblemsService } from "../../services/ProblemsService";
import { ProblemSetService } from "../../services/ProblemSetService";
import CloseIcon from '@material-ui/icons/Close';
import { HeadLink } from "../../models/Folder";
import ExplorerView from "../files/ExplorerView";
import { VersionService } from "../../services/VersionService";
import ProblemPreview from "./ProblemPreview";
import { isNullOrUndefined } from "util";
import ProblemsListView from "./ProblemsListView";
import DurationInput from "./DurationInput";
import { ProblemSet } from "../../models/ProblemSet";
import { CommitId } from "../../models/Identificators";
import { Problem } from "../../models/Problem";
import { Head } from "../../models/Head";

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

interface IProblemsData {
    problems: Array<HeadLink>;
    selected: number | null;
}

export interface ICreateProblemSetDialogProps {
    open: boolean;
    onClose: () => void;
    versionService: VersionService;
    foldersService: FoldersService;
    problemsService: ProblemsService;
    problemSetService: ProblemSetService;
    fileExplorerState: FileExplorerState;
}

export default function CreateProblemDialog(props: ICreateProblemSetDialogProps) {

    const [ title, setTitle ] = React.useState<string>("");
    const [ duration, setDuration ] = React.useState<number>(0);
    const [ explorerState ] = React.useState(new FileExplorerState(props.foldersService));
    const [ sourcePreview, setSourcePreview ] = React.useState<IPreviewData | null>(null);
    const [ problemsData, setProblemsData ] = React.useState<IProblemsData>({ problems: [], selected: null });
    const [ listPreview, setListPreivew ] = React.useState<IPreviewData | null>(null);

    const clean = () => {
        setTitle("");
        setDuration(0);
        setSourcePreview(null);
        setProblemsData({ problems: [], selected: null });
        setListPreivew(null);
    };

    useEffect(() => {
        const headChangedSub = explorerState
            .currentHeadChanged()
            .subscribe(async link => {
                if (!link) {
                    return;
                }

                const head = await props.versionService.getHead(link.id);
                const problem = await props.problemsService.get(head.commit.id);
                setSourcePreview({
                    head: head,
                    problem: problem,
                });
            });

        return () => {
            headChangedSub.unsubscribe();
        };
    });

    const onAdd = () => {
        if (sourcePreview) {
            setProblemsData({
                problems: problemsData.problems.concat([{
                    id: sourcePreview.head.id,
                    name: sourcePreview.head.name,
                    type: sourcePreview.head.commit.target.type
                }]),
                selected: problemsData.selected
            });
        }
    };

    const onRemove = () => {
        if (problemsData.selected !== null) {
            problemsData.problems.splice(problemsData.selected, 1);
            setProblemsData({
                problems: problemsData.problems,
                selected: null
            });
            setListPreivew(null);
        }
    };

    const onSelectInList = async (index: number) => {
        setProblemsData({
            problems: problemsData.problems,
            selected: index
        });
        const link = problemsData.problems[index];
        const head = await props.versionService.getHead(link.id);
        const problem = await props.problemsService.get(head.commit.id);
        setListPreivew({
            head: head,
            problem: problem,
        })
    };

    const onCancel = () => {
        clean();
        props.onClose();
    };

    const onSave = async () => {
        let curFolder = await props.fileExplorerState.currentFolderOrRoot();
        if (!curFolder) {
            return;
        }

        let problemSet : ProblemSet = {
            id: "",
            title: title,
            duration: duration * 60,
            head_ids: problemsData.problems.map(link => link.id)
        };

        let ans = await props.problemSetService.create(curFolder.id, title, problemSet);

        props.fileExplorerState.syncFolder(curFolder.id);

        clean();
        props.onClose();
    };

    const classes = useStyles();

    const sourcePreviewView = sourcePreview ? (
        <ProblemPreview
            problem={sourcePreview.problem} />
    ) : null;

    const listPreviewView = listPreview ? (
        <ProblemPreview
            problem={listPreview.problem} />
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
                            label="Title"
                            onChange={(e) => setTitle(e.target.value)} />
                    </FormControl>
                </ListItem>
                <ListItem>
                    <FormControl className={classes.form}>
                        <DurationInput
                            value={duration}
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
                                state={explorerState}
                                versionService={props.versionService} />
                        </Grid>
                        <Grid item className={classes.sourcePreview}>
                            <Button
                                disabled={isNullOrUndefined(sourcePreview)}
                                onClick={onAdd}>
                                Add
                            </Button>
                            {sourcePreviewView}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item className={classes.listContainer}>
                    <Grid container className={classes.container}>
                        <Grid item className={classes.list}>
                            <ProblemsListView
                                links={problemsData.problems}
                                onSelect={(index) => onSelectInList(index)} />
                        </Grid>
                        <Grid item className={classes.listPreview}>
                            <Button
                                disabled={isNullOrUndefined(problemsData.selected)}
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