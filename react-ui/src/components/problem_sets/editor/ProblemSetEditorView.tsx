import { makeStyles, TextField, Button, List, ListItem, FormControl, Grid, Box } from "@material-ui/core";
import React, { useEffect } from "react";
import ProblemPreview from "../ProblemPreview";
import SlotsListView from "../SlotsListView";
import DurationInput from "../DurationInput";
import { ProblemSet } from "../../../models/ProblemSet";
import { Problem } from "../../../models/Problem";
import { HeadId } from "../../../models/Identificators";

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

export interface IProblemSetEditorActions {
    onUpdate(problemSet: ProblemSet): void;
    fetchAddPreview(headId: HeadId): void;
    fetchRemovePreview(headId: HeadId): void;
    selectSlot(pos: number): void;
    selectProblemInSlot(slot: number, problem: number): void;
};

export interface IProblemSetEditorParameters {
    problemSet: ProblemSet;
    selectedAddProblem: HeadId | null;
    problemsTree: JSX.Element;
    selectedSlot: number | null;
    selectedProblemInSlot: number | null;
    addPreview: {
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'succeeded';
        headId: HeadId;
        problem: Problem;
    };
    removePreview: {
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'succeeded';
        headId: HeadId;
        problem: Problem;
    };
};

export interface IProblemSetEditorProps extends IProblemSetEditorActions, IProblemSetEditorParameters {
}

export default function ProblemSetEditor(props: IProblemSetEditorProps) {
    useEffect(() => {
        if (props.addPreview.loading === 'idle' ||
            (props.addPreview.loading === 'succeeded' && props.addPreview.headId !== props.selectedAddProblem)) {
            if (props.selectedAddProblem) {
                props.fetchAddPreview(props.selectedAddProblem);
            }
        }

        if (props.selectedSlot && props.selectedProblemInSlot) {
            const headId = 
                props
                    .problemSet
                    .slots[props.selectedSlot]
                    ?.head_ids[props.selectedProblemInSlot]
                    ?? null;
            if (headId) {
                if (props.removePreview.loading === 'idle' ||
                    (props.removePreview.loading === 'succeeded' && props.removePreview.headId !== headId)) {
                    props.fetchAddPreview(headId);
                }
            }
        }
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
            ? (props.selectedSlot !== null ? props.selectedSlot : 0)
            : (props.selectedSlot !== null ? props.selectedSlot + 1 : slots.length);


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
        if (props.selectedAddProblem && props.selectedSlot !== null) {
            const slots = [...props.problemSet.slots];
            const slot = slots[props.selectedSlot];
            slots[props.selectedSlot] = {
                ...slot,
                head_ids: slot.head_ids.concat([ props.selectedAddProblem ])
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

    const classes = useStyles();

    const getAddPreview = () => {
        if (props.addPreview.loading === 'succeeded') {
            return (
                <ProblemPreview
                    problem={props.addPreview.problem} />
            );
        }
        else {
            return (<div/>);
        }
    };

    const getRemovePreview = () => {
        if (props.removePreview.loading === 'succeeded') {
            return (
                <ProblemPreview
                    problem={props.removePreview.problem} />
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
                            {props.problemsTree}
                        </Grid>
                        <Grid item className={classes.sourcePreview}>
                            <Button
                                disabled={props.addPreview.loading !== 'succeeded' || props.selectedSlot === null}
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
                                selectedSlot={props.selectedSlot}
                                selectedProblemInSlot={props.selectedProblemInSlot}
                                onRemoveProblem={onRemove}
                                onRemoveSlot={onRemoveSlot}
                                onSelectSlot={props.selectSlot}
                                onSelectProblemInSlot={props.selectProblemInSlot}
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