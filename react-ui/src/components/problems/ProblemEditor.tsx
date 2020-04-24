import { makeStyles, List, ListItem, FormControl, TextField, Container, IconButton, Box } from "@material-ui/core";
import React, { useEffect } from "react";
import { ProblemsService } from "../../services/ProblemsService";
import { Commit } from "../../models/Commit";
import ControllerEditor from "./ControllerEditor";
import ViewEditor from "./ViewEditor";
import ValidatorEditor from "./ValidatorEditor";
import { Controller } from "../../models/Controller";
import { View } from "../../models/View";
import { Validator } from "../../models/Validator";
import { Problem } from "../../models/Problem";
import { FileExplorerState } from "../../states/FileExplorerState";
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import BugReportIcon from '@material-ui/icons/BugReport';
import { GeneratedProblem } from "../../models/GeneratedProblem";
import TestProblemDialog from "./TestProblemDialog";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%"
    },
    list: {
        width: "100%",
    },
    formControl: {
        margin: theme.spacing(1),
        width: "100%",
        minWidth: 120,
    },
}));

interface IProblemEditorState {
    description: string;
    disabled: boolean;
    problem: Problem | null;
    generatedProblem: GeneratedProblem | null;
    testProblemDialogOpened: boolean;
}

export interface IProblemEditorProps {
    commit: Commit;
    problemsService: ProblemsService;
    fileExplorerState: FileExplorerState;
}

export default function ProblemEditor(props: IProblemEditorProps) {

    const [ state, setState ] = React.useState<IProblemEditorState>({
        description: props.commit.description,
        disabled: true,
        problem: null,
        testProblemDialogOpened: false,
        generatedProblem: null
    });

    const sync = (commit: Commit) => {
        props.problemsService
            .get(commit.id)
            .then(problem => {
                setState({
                    ...state,
                    problem: problem
                });
            });
    };

    useEffect(() => {
        if (state.problem !== null && state.problem.id === props.commit.target.id) {
            return;
        }
        sync(props.commit);
    });

    const setTitle = (value: string) => {
        if (state.problem) {
            setState({
                ...state,
                problem: {
                    ...state.problem,
                    title: value
                }
            });
        }
    };

    const setController = (value: Controller) => {
        if (state.problem) {
            setState({
                ...state,
                problem: {
                    ...state.problem,
                    controller: value
                }
            });
        }
    };

    const setView = (value: View) => {
        if (state.problem) {
            setState({
                ...state,
                problem: {
                    ...state.problem,
                    view: value
                }
            });
        }
    };

    const setValidator = (value: Validator) => {
        if (state.problem) {
            setState({
                ...state,
                problem: {
                    ...state.problem,
                    validator: value
                }
            });
        }
    };

    const onCancel = () => {
        setState({
            ...state,
            disabled: true,
            description: props.commit.description
        });
        sync(props.commit);
    };
    const onEdit = () => {
        setState({
            ...state,
            disabled: false,
            description: ""
        });
    };
    const onSave = async () => {
        if (!state.problem) {
            return;
        }

        await props.problemsService.update(
            props.commit.head_id,
            state.description,
            state.problem
        );
        setState({
            ...state,
            disabled: true
        });
        props.fileExplorerState.syncHead(props.commit.head_id);
    };

    const onTest = async () => {
        let generatedProblem = await props.problemsService.test(props.commit.id, Math.floor(Math.random() * 1000000));
        setState({
            ...state,
            generatedProblem: generatedProblem,
            testProblemDialogOpened: true
        });
    };

    const onCloseTest = () => {
        setState({
            ...state,
            generatedProblem: null,
            testProblemDialogOpened: false
        });
    };

    const onRefreshTest = async (seed: number) => {
        let generatedProblem = await props.problemsService.test(props.commit.id, seed);
        setState({
            ...state,
            generatedProblem: generatedProblem,
        });
    };

    const classes = useStyles();

    let testProblemDialog = state.generatedProblem === null ? null : (
        <TestProblemDialog
            open={state.testProblemDialogOpened}
            commitId={props.commit.id}
            onClose={onCloseTest}
            onUpdate={onRefreshTest}
            generatedProblem={state.generatedProblem}
            problemsService={props.problemsService}
            />
    );

    if (state.problem)
        return (
            <Box className={classes.root}>
                <Container>
                    <IconButton
                        onClick={onSave}
                        disabled={state.disabled}
                        color="primary"
                        aria-label="Save">
                        <SaveIcon />
                    </IconButton>
                    <IconButton
                        onClick={onEdit}
                        color="primary"
                        disabled={!state.disabled}
                        aria-label="Edit">
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={onTest}
                        color="primary"
                        disabled={!state.disabled}
                        aria-label="Test">
                        <BugReportIcon />
                    </IconButton>
                    <IconButton
                        onClick={onCancel}
                        disabled={state.disabled}
                        color="primary"
                        aria-label="Cancel">
                        <CancelIcon />
                    </IconButton>
                </Container>
                {testProblemDialog}
                <List
                    className={classes.list}>
                    <ListItem>
                        <FormControl className={classes.formControl}>
                            <TextField
                                label="Change description"
                                value={state.description}
                                onChange={(e) => setState({ ...state, description: e.target.value })}
                                disabled={state.disabled} />
                        </FormControl>
                    </ListItem>
                    <ListItem>

                        <FormControl className={classes.formControl}>
                            <TextField
                                label="Title"
                                value={state.problem.title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={state.disabled} />
                        </FormControl>
                    </ListItem>
                    <ListItem>
                        <ControllerEditor
                            value={state.problem.controller}
                            onChange={(v) => setController(v)}
                            disabled={state.disabled} />
                    </ListItem>
                    <ListItem>
                        <ViewEditor
                            value={state.problem.view}
                            onChange={(v) => setView(v)}
                            disabled={state.disabled} />
                    </ListItem>
                    <ListItem>
                        <ValidatorEditor
                            value={state.problem.validator}
                            onChange={(v) => setValidator(v)}
                            disabled={state.disabled} />
                    </ListItem>
                </List>
            </Box>
        );
    else
        return <Box className={classes.root}/>
};