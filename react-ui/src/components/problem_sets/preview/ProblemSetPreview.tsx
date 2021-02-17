import { makeStyles, Box, List, ListItem, Container, IconButton, Typography, Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import EditIcon from '@material-ui/icons/Edit';
import { HeadId } from "../../../models/Identificators";
import SlotsListView from "../SlotsListView";
import ProblemPreview from "../ProblemPreview";
import EditProblemSetDialogContainer from "../dialogs/EditProblemSetDialogContainer";
import { AccessModel, CommitModel, ProblemModel, ProblemSetModel } from "../../../models/domain";

const useStyles = makeStyles(() => ({
    root: {
        width: "100%",
        height: "100%"
    },
    fieldTitle: {
        fontSize: 14,
      },
    list: {
        width: "100%",
    },
    listContainer: {
        width: "100%",
        height: "100%",
    },
    problemsList: {
        width: "30%",
    },
    listPreview: {
        width: "70%",
    },
}));

export interface IProblemSetPreviewParameters {
    headId: HeadId | null;

    problemSetPreview: {
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'successed';
        commit: CommitModel;
        access: AccessModel;
        problemSet: ProblemSetModel;
    };
    selectedSlot: number | null;
    selectedProblemInSlot: number | null;
    problemPreview:{
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'successed';
        headId: HeadId;
        problem: ProblemModel;
    };
};

export interface IProblemSetPreviewActions {
    fetchProblemSetPreview(headId: HeadId): void;
    fetchProblemPreview(headId: HeadId): void;
    selectSlot(slot: number): void;
    selectProblemInSlot(slot: number, problem: number): void;
    openEditDialog(problemSet: ProblemSetModel): void;
};

export interface IProblemSetPreviewProps extends IProblemSetPreviewActions, IProblemSetPreviewParameters{
}

export default function ProblemSetPreview(props: IProblemSetPreviewProps) {

    useEffect(() => {
        if (!props.headId) {
            return;
        }

        if (props.problemSetPreview.loading === 'idle'
            || (props.problemSetPreview.loading === 'successed' && props.headId !== props.problemSetPreview.commit.headId)) {
            props.fetchProblemSetPreview(props.headId);
        }

        if (props.problemSetPreview.loading === 'successed') {
            if (props.selectedSlot !== null && props.selectedProblemInSlot !== null) {
                const problemHeadId =
                    props.problemSetPreview
                        .problemSet
                        .slotsList[props.selectedSlot]
                        ?.headIdsList[props.selectedProblemInSlot] ?? null;

                if (problemHeadId !== null && (props.problemPreview.loading === 'idle' || (props.problemPreview.loading === 'successed' && props.problemPreview.headId !== problemHeadId))) {
                    props.fetchProblemPreview(problemHeadId);
                }
            }
        }
    });

    const onEdit = () => { 
        if (props.problemSetPreview.loading === 'successed') {
            props.openEditDialog(props.problemSetPreview.problemSet);
        }
    };

    const classes = useStyles();

    if (props.problemSetPreview.loading !== 'successed') {
        return (<div />);
    }

    const getPreview = () => {
        if (props.problemPreview.loading === 'successed') {
            return (
                <ProblemPreview
                    problem={props.problemPreview.problem} />
            );
        }
        else {
            return (<div/>);
        }
    };

    return (
        <Box className={classes.root}>
            <Container>
                <IconButton
                    onClick={onEdit}
                    disabled={!props.problemSetPreview.access.write}
                    color="primary"
                    aria-label="Edit">
                    <EditIcon />
                </IconButton>
            </Container>
            <EditProblemSetDialogContainer />
            <List
                className={classes.list}>
                <ListItem key="desc">
                    <Box>
                        <Typography className={classes.fieldTitle} color="textSecondary" gutterBottom>
                            Commit description
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {props.problemSetPreview.commit.description}
                        </Typography>
                    </Box>
                </ListItem>
                <ListItem key="title">
                    <Box>
                        <Typography className={classes.fieldTitle} color="textSecondary" gutterBottom>
                            Title
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {props.problemSetPreview.problemSet.title}
                        </Typography>
                    </Box>
                </ListItem>
                <ListItem key="duration">
                    <Box>
                        <Typography className={classes.fieldTitle} color="textSecondary" gutterBottom>
                            Duration
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {props.problemSetPreview.problemSet.durationS / 60} min
                        </Typography>
                    </Box>
                </ListItem>
                <Grid container className={classes.listContainer}>
                    <Grid item className={classes.problemsList}>
                        <SlotsListView
                            slots={props.problemSetPreview.problemSet.slotsList}
                            selectedSlot={props.selectedSlot}
                            selectedProblemInSlot={props.selectedProblemInSlot}
                            onSelectSlot={props.selectSlot}
                            onSelectProblemInSlot={props.selectProblemInSlot}
                            />
                    </Grid>
                    <Grid item className={classes.listPreview}>
                        {getPreview()}
                    </Grid>
                </Grid>
            </List>
        </Box>
    );
};