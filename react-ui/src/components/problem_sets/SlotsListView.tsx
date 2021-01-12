import { makeStyles, List, ListItem, Card, CardContent, Typography, CardActions, IconButton } from "@material-ui/core";
import React from "react";
import { ProblemSlot } from "../../models/ProblemSet";
import ProblemHeadListItemView from "./ProblemHeadListItemView";
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 200,
        maxHeight: 600,
        overflowX: "scroll"
    },
    slot: {
        width: "100%",
    },
    problems: {
        width: "100%",
    }
}));

export interface ISlotsListViewProps {
    slots: Array<ProblemSlot>;
    selectedSlot: number | null;
    selectedProblemInSlot: number | null;
    onRemoveSlot?(index: number): void;
    onRemoveProblem?(slotIndex: number, index: number): void;
    onSelectSlot(index: number): void;
    onSelectProblemInSlot(slotIndex: number, index: number): void;
}

export default function SlotsListView(props: ISlotsListViewProps) {

    const classes = useStyles();

    const onSlotClick = (index: number) => {
        props.onSelectSlot(index);
    };

    const getSlotAction = (slotIndex: number) => {
        if (props.onRemoveSlot) {
            const onRemoveSlot = () => {
                if (props.onRemoveSlot) {
                    props.onRemoveSlot(slotIndex);
                }
            };
            return (
                <IconButton
                    size="small"
                    color="primary"
                    onClick={onRemoveSlot}
                    >
                    <DeleteIcon/>
                </IconButton>
            );
        }
        else {
            return (<div/>);
        }
    };

    const getOnRemoveProblem = (slotIndex: number) => {
        if (props.onRemoveProblem) {
            return (index: number) => {
                if (props.onRemoveProblem) {
                    props.onRemoveProblem(slotIndex, index);
                }
            };
        }
        else {
            return undefined;
        }
    };

    return (
        <List component="nav" className={classes.root}>
            {
                props.slots.map((slot, slotIndex) => {
                        return (
                            <ListItem
                                key={"slot_" + slotIndex}
                                selected={props.selectedSlot === slotIndex}
                                onClick={() => onSlotClick(slotIndex)}>
                                <Card className={classes.slot}>
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="h2">
                                            {"Slot " + (slotIndex + 1)}
                                        </Typography>
                                        <List className={classes.problems}>
                                            {
                                                slot.head_ids.map((headId, headIndex) => {
                                                    return (
                                                        <ProblemHeadListItemView
                                                            key={`slot_${slotIndex}_head_${headIndex}`}
                                                            headId={headId}
                                                            index={headIndex}
                                                            selected={props.selectedSlot === slotIndex && props.selectedProblemInSlot === headIndex}
                                                            onClick={(index) => props.onSelectProblemInSlot(slotIndex, index)}
                                                            onRemove={getOnRemoveProblem(slotIndex)}
                                                            />
                                                    );
                                                })
                                            }
                                        </List>
                                    </CardContent>
                                    <CardActions>
                                        {getSlotAction(slotIndex)}
                                    </CardActions>
                                </Card>
                            </ListItem>
                        )
                    })
            }
        </List>
    );
}