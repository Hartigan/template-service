import { makeStyles, Box, List, ListItem, Container, IconButton, Typography, Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import { ProblemsService } from "../../services/ProblemsService";
import { Commit } from "../../models/Commit";
import EditIcon from '@material-ui/icons/Edit';
import { ProblemSetService } from "../../services/ProblemSetService";
import { ProblemSet } from "../../models/ProblemSet";
import { ProblemSetId } from "../../models/Identificators";
import { Problem } from "../../models/Problem";
import { VersionService } from "../../services/VersionService";
import SlotsListView from "./SlotsListView";
import ProblemPreview from "./ProblemPreview";
import EditProblemSetDialog from "./EditProblemSetDialog";
import { FoldersService } from "../../services/FoldersService";
import { Access } from "../../models/Permissions";
import { PermissionsService } from "../../services/PermissionsService";

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

interface IState {
    problemSet: {
        value: ProblemSet;
        access: Access;
    } | null;
    selectedSlot: number | null;
    selectedProblemInSlot: number | null;
    preview: Problem | null;
    editOpened: boolean;
}

export interface IProblemSetPreviewProps {
    commit: Commit;
    problemsService: ProblemsService;
    problemSetService: ProblemSetService;
    versionService: VersionService;
    foldersService: FoldersService;
    permissionsService: PermissionsService;
    onSync: () => void;
}

export default function ProblemSetPreview(props: IProblemSetPreviewProps) {

    const [ state, setState ] = React.useState<IState>({
        problemSet: null,
        selectedSlot: null,
        selectedProblemInSlot: null,
        preview: null,
        editOpened: false
    });

    const fetchProblemSet = async (commit: Commit) => {
        const problemSet = await props.problemSetService.get(props.commit.id);
        const access = await props.permissionsService.getAccess({ id: props.commit.head_id, type: "head" });
        return {
            value: problemSet,
            access: access
        };
    };

    useEffect(() => {
        let canUpdate = true;

        const problemId : ProblemSetId = props.commit.target.id;

        if (state.problemSet === null || state.problemSet.value.id !== problemId) {
            fetchProblemSet(props.commit)
                .then(problemSet => {
                    if (canUpdate) {
                        setState({
                            ...state,
                            problemSet: problemSet
                        });
                    }
                });
        }

        if (state.problemSet !== null &&
            state.selectedSlot !== null &&
            state.selectedProblemInSlot !== null &&
            state.preview === null) {

            props.versionService
                .getHead(state.problemSet.value.slots[state.selectedSlot].head_ids[state.selectedProblemInSlot])
                .then(head => {
                    props.problemsService
                        .get(head.commit.id)
                        .then(problem => {
                            if (canUpdate) {
                                setState({
                                    ...state,
                                    preview: problem
                                })
                            }
                        });
                });
        }

        return () => {
            canUpdate = false;
        };
    });

    const onEdit = () => { 
        setState({
            ...state,
            editOpened: true
        });
    };

    const onSelectSlot = (index: number) => {
        if (index !== state.selectedSlot) {
            setState({
                ...state,
                selectedSlot: index,
                selectedProblemInSlot: null,
                preview: null
            });
        }
    };

    const onSelectInSlot = (slotIndex: number, index: number) => {
        if (index !== state.selectedProblemInSlot || slotIndex !== state.selectedSlot) {
            setState({
                ...state,
                selectedSlot: slotIndex,
                selectedProblemInSlot: index,
                preview: null
            });
        }
    };

    const classes = useStyles();

    if (!state.problemSet) {
        return (<div />);
    }

    const onCloseEdit = () => {
        setState({
            ...state,
            editOpened: false
        });
        props.onSync();
    };

    const getPreview = () => {
        if (state.preview) {
            return (
                <ProblemPreview
                    problem={state.preview} />
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
                    disabled={!state.problemSet.access.write}
                    color="primary"
                    aria-label="Edit">
                    <EditIcon />
                </IconButton>
            </Container>
            <EditProblemSetDialog
                open={state.editOpened}
                headId={props.commit.head_id}
                problemSet={state.problemSet.value}
                onClose={onCloseEdit}
                versionService={props.versionService}
                foldersService={props.foldersService}
                problemsService={props.problemsService}
                problemSetService={props.problemSetService}
                />
            <List
                className={classes.list}>
                <ListItem key="desc">
                    <Box>
                        <Typography className={classes.fieldTitle} color="textSecondary" gutterBottom>
                            Commit description
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {props.commit.description}
                        </Typography>
                    </Box>
                </ListItem>
                <ListItem key="title">
                    <Box>
                        <Typography className={classes.fieldTitle} color="textSecondary" gutterBottom>
                            Title
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {state.problemSet.value.title}
                        </Typography>
                    </Box>
                </ListItem>
                <ListItem key="duration">
                    <Box>
                        <Typography className={classes.fieldTitle} color="textSecondary" gutterBottom>
                            Diration
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {state.problemSet.value.duration / 60} min
                        </Typography>
                    </Box>
                </ListItem>
                <Grid container className={classes.listContainer}>
                    <Grid item className={classes.problemsList}>
                        <SlotsListView
                            slots={state.problemSet.value.slots}
                            selectedSlot={state.selectedSlot}
                            selectedProblemInSlot={state.selectedProblemInSlot}
                            versionService={props.versionService}
                            onSelectSlot={onSelectSlot}
                            onSelectProblemInSlot={onSelectInSlot}
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