import { makeStyles, TextField, Button, List, ListItem, FormControl, Grid, Box } from "@material-ui/core";
import React, { useEffect } from "react";
import { FoldersService } from "../../services/FoldersService";
import { FileExplorerState } from "../../states/FileExplorerState";
import { ProblemsService } from "../../services/ProblemsService";
import ExplorerView from "../files/ExplorerView";
import { VersionService } from "../../services/VersionService";
import ProblemPreview from "./ProblemPreview";
import SlotsListView from "./SlotsListView";
import DurationInput from "./DurationInput";
import { ProblemSet } from "../../models/ProblemSet";
import { Problem } from "../../models/Problem";
import { Head } from "../../models/Head";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%"
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

interface IState {
    explorer: FileExplorerState;
    addPreview: IPreviewData | null;
    removePreview: IPreviewData | null;
    selectedSlot: number | null;
    selectedProblemInSlot: number | null;
}

export interface IProblemSetEditorProps {
    problemSet: ProblemSet;
    onUpdate(problemSet: ProblemSet): void;
    versionService: VersionService;
    foldersService: FoldersService;
    problemsService: ProblemsService;
}

export default function ProblemSetEditor(props: IProblemSetEditorProps) {
    const [ state, setState ] = React.useState<IState>({
        explorer: new FileExplorerState(props.foldersService),
        addPreview: null,
        removePreview: null,
        selectedSlot: null,
        selectedProblemInSlot: null,
    })

    useEffect(() => {
        let canUpdate = true;
        const headChangedSub = state.explorer
            .currentHeadChanged()
            .subscribe(async link => {
                if (!link) {
                    return;
                }

                const head = await props.versionService.getHead(link.id);
                const problem = await props.problemsService.get(head.commit.id);
                setState({
                    ...state,
                    addPreview: {
                        head: head,
                        problem: problem
                    }
                });
            });


        if (state.removePreview === null && state.selectedProblemInSlot !== null && state.selectedSlot !== null) {
            const headId = props.problemSet.slots[state.selectedSlot].head_ids[state.selectedProblemInSlot];
            props.versionService
                .getHead(headId)
                .then(head => {
                    props.problemsService
                        .get(head.commit.id)
                        .then(problem => {
                            if (!canUpdate) {
                                return;
                            }

                            setState({
                                ...state,
                                removePreview: {
                                    head: head,
                                    problem: problem
                                }
                            })
                        });
                })
        }

        return () => {
            headChangedSub.unsubscribe();
            canUpdate = false;
        };
    });

    const setTitle = (title: string) => {
        props.onUpdate({
            ...props.problemSet,
            title: title
        });
    };

    const setDuration = (duration: number) => {
        props.onUpdate({
            ...props.problemSet,
            duration: duration
        });
    };

    const onAddSlot = (isAbove: boolean) => {
        const newSlot = { 
            head_ids: []
        };

        const slots = [...props.problemSet.slots];

        const pos = isAbove
            ? (state.selectedSlot !== null ? state.selectedSlot : 0)
            : (state.selectedSlot !== null ? state.selectedSlot + 1 : slots.length);


        slots.splice(pos, 0, newSlot);

        props.onUpdate({
            ...props.problemSet,
            slots: slots
        });
    };

    const onRemoveSlot = (index: number) => {
        const slots = [...props.problemSet.slots];
        slots.splice(index, 1);

        props.onUpdate({
            ...props.problemSet,
            slots: slots
        });
    };

    const onAdd = () => {
        if (state.addPreview && state.selectedSlot !== null) {
            const slots = [...props.problemSet.slots];
            const slot = slots[state.selectedSlot];
            slots[state.selectedSlot] = {
                ...slot,
                head_ids: slot.head_ids.concat([ state.addPreview.head.id ])
            };

            props.onUpdate({
                ...props.problemSet,
                slots: slots
            })
        }
    };

    const onRemove = (slotIndex: number, index: number) => {
        const slot = props.problemSet.slots[slotIndex];
        const headIds = [...slot.head_ids];
        headIds.splice(index, 1);
        const slots = [...props.problemSet.slots];
        slots[slotIndex].head_ids = headIds;

        props.onUpdate({
            ...props.problemSet,
            slots: slots
        });
    };

    const onSelectSlot = (index: number) => {
        if (index !== state.selectedSlot) {
            setState({
                ...state,
                selectedSlot: index,
                selectedProblemInSlot: null,
                removePreview: null
            });
        }
    };

    const onSelectInSlot = (slotIndex: number, index: number) => {
        if (state.selectedSlot !== slotIndex || state.selectedProblemInSlot !== index) {
            setState({
                ...state,
                selectedSlot: slotIndex,
                selectedProblemInSlot: index,
                removePreview: null
            });
        }
    };

    const classes = useStyles();

    const getAddPreview = () => {
        if (state.addPreview) {
            return (
                <ProblemPreview
                    problem={state.addPreview.problem} />
            );
        }
        else {
            return (<div/>);
        }
    };

    const getRemovePreview = () => {
        if (state.removePreview) {
            return (
                <ProblemPreview
                    problem={state.removePreview.problem} />
            );
        }
        else {
            return (<div/>);
        }
    };

    return (
        <Box className={classes.root}>
            <List
                className={classes.formList}>
                <ListItem>
                    <FormControl className={classes.form}>
                        <TextField
                            label="Title"
                            value={props.problemSet.title}
                            onChange={(e) => setTitle(e.target.value)} />
                    </FormControl>
                </ListItem>
                <ListItem>
                    <FormControl className={classes.form}>
                        <DurationInput
                            value={props.problemSet.duration / 60}
                            onChange={(mins) => setDuration(mins * 60)}
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
                                state={state.explorer}
                                filter={["problem"]}
                                versionService={props.versionService} />
                        </Grid>
                        <Grid item className={classes.sourcePreview}>
                            <Button
                                disabled={state.addPreview === null || state.selectedSlot === null}
                                onClick={onAdd}>
                                Add
                            </Button>
                            {getAddPreview()}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item className={classes.listContainer}>
                    <Grid container className={classes.container}>
                        <Grid item className={classes.list}>
                            <SlotsListView
                                slots={props.problemSet.slots}
                                selectedSlot={state.selectedSlot}
                                selectedProblemInSlot={state.selectedProblemInSlot}
                                versionService={props.versionService}
                                onRemoveProblem={onRemove}
                                onRemoveSlot={onRemoveSlot}
                                onSelectSlot={onSelectSlot}
                                onSelectProblemInSlot={onSelectInSlot}
                                />
                        </Grid>
                        <Grid item className={classes.listPreview}>
                            <Button
                                onClick={() => onAddSlot(true)}>
                                Add slot above
                            </Button>
                            <Button
                                onClick={() => onAddSlot(false)}>
                                Add slot below
                            </Button>
                            {getRemovePreview()}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};