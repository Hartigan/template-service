import { makeStyles, TextField, Button, List, ListItem, FormControl, Grid, Box } from "@material-ui/core";
import React, { useEffect } from "react";
import ProblemPreview from "../ProblemPreview";
import SlotsListView, { ISlotData } from "../SlotsListView";
import DurationInput from "../DurationInput";
import { HeadId } from "../../../models/Identificators";
import { HeadModel, ProblemModel, ProblemSetModel } from "../../../models/domain";
import { ProblemSet } from "../../../protobuf/domain_pb";

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


export type SlotsDelta = {
    type: "add_slot";
    index: number;
} | {
    type: "remove_slot";
    index: number;
} | {
    type: "add_problem";
    index: number;
    problemIndex: number;
} | {
    type: "remove_problem";
    index: number;
    problemIndex: number;
};

export interface IProblemSetEditorActions {
    onUpdate(problemSet: ProblemSetModel): void;
    initSlots(slotsList: Array<ProblemSet.Slot.AsObject>): void;
    fetchAddPreview(headId: HeadId): void;
    fetchRemovePreview(headId: HeadId): void;
    addSlot(slotIndex: number): void;
    addProblemIntoSlot(slotIndex: number, problemIndex: number, head: HeadModel): void;
    removeSlot(slotIndex: number): void;
    removeProblemFromSlot(slotIndex: number, problemIndex: number): void;
    selectSlot(pos: number): void;
    selectProblemInSlot(slot: number, problem: number): void;
};

export interface IProblemSetEditorParameters {
    problemSet: ProblemSetModel;
    slots: {
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'succeeded';
        data: Array<ISlotData>;
    };
    selectedAddProblem: HeadId | null;
    problemsTree: JSX.Element;
    selectedSlot: number | null;
    selectedProblemInSlot: number | null;
    addPreview: {
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'succeeded';
        head: HeadModel;
        problem: ProblemModel;
    };
    removePreview: {
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'succeeded';
        head: HeadModel;
        problem: ProblemModel;
    };
};

export interface IProblemSetEditorProps extends IProblemSetEditorActions, IProblemSetEditorParameters {
}

export default function ProblemSetEditor(props: IProblemSetEditorProps) {
    useEffect(() => {

        if (props.slots.loading === 'idle') {
            props.initSlots(props.problemSet.slotsList);
        }

        if (props.addPreview.loading === 'idle' ||
            (props.addPreview.loading === 'succeeded' && props.addPreview.head.id !== props.selectedAddProblem)) {
            if (props.selectedAddProblem) {
                props.fetchAddPreview(props.selectedAddProblem);
            }
        }

        if (props.selectedSlot && props.selectedProblemInSlot) {
            const headId = 
                props
                    .problemSet
                    .slotsList[props.selectedSlot]
                    ?.headIdsList[props.selectedProblemInSlot]
                    ?? null;
            if (headId) {
                if (props.removePreview.loading === 'idle' ||
                    (props.removePreview.loading === 'succeeded' && props.removePreview.head.id !== headId)) {
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
            durationS: duration
        });
    };

    const onAddSlot = (isAbove: boolean) => {
        const newSlot = { 
            headIdsList: []
        };

        const slots = [...props.problemSet.slotsList];

        const pos = isAbove
            ? (props.selectedSlot !== null ? props.selectedSlot : 0)
            : (props.selectedSlot !== null ? props.selectedSlot + 1 : slots.length);


        slots.splice(pos, 0, newSlot);

        props.addSlot(pos);

        props.onUpdate({
            ...props.problemSet,
            slotsList: slots
        });
    };

    const onRemoveSlot = (index: number) => {
        const slots = [...props.problemSet.slotsList];
        slots.splice(index, 1);

        props.removeSlot(index);

        props.onUpdate({
            ...props.problemSet,
            slotsList: slots
        });
    };

    const onAdd = () => {
        if (props.selectedAddProblem && props.selectedSlot !== null && props.addPreview.loading === "succeeded") {
            const slots = [...props.problemSet.slotsList];
            const slot = slots[props.selectedSlot];
            slots[props.selectedSlot] = {
                ...slot,
                headIdsList: slot.headIdsList.concat([ props.selectedAddProblem ])
            };

            props.addProblemIntoSlot(props.selectedSlot, slot.headIdsList.length, props.addPreview.head);

            props.onUpdate({
                ...props.problemSet,
                slotsList: slots
            })
        }
    };

    const onRemove = (slotIndex: number, index: number) => {
        const slot = props.problemSet.slotsList[slotIndex];
        const headIds = [...slot.headIdsList];
        headIds.splice(index, 1);
        const slots = [...props.problemSet.slotsList];
        slots[slotIndex] = {
            ...props.problemSet.slotsList[slotIndex],
            headIdsList: headIds
        };

        props.removeProblemFromSlot(slotIndex, index);

        props.onUpdate({
            ...props.problemSet,
            slotsList: slots
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
                            value={props.problemSet.durationS / 60}
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
                                variant="outlined"
                                color="primary"
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
                                slots={props.slots.loading === "succeeded" ? props.slots.data : []}
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
                                variant="outlined"
                                color="primary"
                                onClick={() => onAddSlot(true)}>
                                Add slot above
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
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