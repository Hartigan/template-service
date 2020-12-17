import { makeStyles, List, ListItem, FormControl, TextField, Container, IconButton, Box } from "@material-ui/core";
import React, { useEffect } from "react";
import { Commit } from "../../../models/Commit";
import ControllerEditor from "../ControllerEditor";
import ViewEditor from "../ViewEditor";
import ValidatorEditor from "../ValidatorEditor";
import { Controller } from "../../../models/Controller";
import { View } from "../../../models/View";
import { Validator } from "../../../models/Validator";
import { Problem } from "../../../models/Problem";
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import BugReportIcon from '@material-ui/icons/BugReport';
import { Access } from "../../../models/Permissions";
import { HeadId } from "../../../models/Identificators";
import TestProblemDialogContainer from "../dialog/TestProblemDialogContainer";

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
        maxWidth: 320
    },
}));

export interface IProblemEditorParameters {
    description: string;
    disabled: boolean;
    data: {
        loading: 'idle' | 'pending';
    } | {
        loading: 'succeeded';
        commit: Commit;
        problem: Problem;
        access: Access;
    },
    updating: 'idle' | 'pending';
};

export interface IProblemEditorParameters {
    description: string;
    disabled: boolean;
    data: {
        loading: 'idle' | 'pending';
    } | {
        loading: 'succeeded';
        commit: Commit;
        problem: Problem;
        access: Access;
    },
    updating: 'idle' | 'pending';
    headId: HeadId | null;
}

export interface IProblemEditorActions {
    fetchProblem(headId: HeadId): void;
    saveProblem(headId: HeadId, description: string, problem: Problem): void;
    updateTitle(title: string): void;
    updateController(controller: Controller): void;
    updateView(view: View): void;
    updateValidator(validator: Validator): void;
    edit(): void;
    cancel(): void;
    updateDescription(description: string): void;
    openTest(): void;
}

export interface IProblemEditorProps extends IProblemEditorActions, IProblemEditorParameters {
}

export default function ProblemEditor(props: IProblemEditorProps) {
    useEffect(() => {
        if (props.headId === null) {
            return;
        }

        if (props.data.loading === 'idle' || (props.data.loading === 'succeeded' && props.data.commit.head_id !== props.headId)) {
            props.fetchProblem(props.headId);
        }
    });

    const classes = useStyles();

    const onSave = () => {
        if (props.data.loading === 'succeeded') {
            props.saveProblem(props.data.commit.head_id, props.description, props.data.problem);
        }
    };

    if (props.data.loading === 'succeeded')
        return (
            <Box className={classes.root}>
                <Container>
                    <IconButton
                        onClick={onSave}
                        disabled={props.disabled}
                        color="primary"
                        aria-label="Save">
                        <SaveIcon />
                    </IconButton>
                    <IconButton
                        onClick={props.edit}
                        color="primary"
                        disabled={!props.disabled || !props.data.access.write}
                        aria-label="Edit">
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={props.openTest}
                        color="primary"
                        disabled={!props.disabled}
                        aria-label="Test">
                        <BugReportIcon />
                    </IconButton>
                    <IconButton
                        onClick={props.cancel}
                        disabled={props.disabled}
                        color="primary"
                        aria-label="Cancel">
                        <CancelIcon />
                    </IconButton>
                </Container>
                <TestProblemDialogContainer />
                <List
                    className={classes.list}>
                    <ListItem>
                        <FormControl className={classes.formControl}>
                            <TextField
                                label="Change description"
                                value={props.description}
                                onChange={(e) => props.updateDescription(e.target.value)}
                                disabled={props.disabled} />
                        </FormControl>
                    </ListItem>
                    <ListItem>
                        <FormControl className={classes.formControl}>
                            <TextField
                                label="Title"
                                value={props.data.problem.title}
                                onChange={(e) => props.updateTitle(e.target.value)}
                                disabled={props.disabled} />
                        </FormControl>
                    </ListItem>
                    <ListItem>
                        <ControllerEditor
                            value={props.data.problem.controller}
                            onChange={props.updateController}
                            disabled={props.disabled} />
                    </ListItem>
                    <ListItem>
                        <ViewEditor
                            value={props.data.problem.view}
                            onChange={props.updateView}
                            disabled={props.disabled} />
                    </ListItem>
                    <ListItem>
                        <ValidatorEditor
                            value={props.data.problem.validator}
                            onChange={props.updateValidator}
                            disabled={props.disabled} />
                    </ListItem>
                </List>
            </Box>
        );
    else
        return <Box className={classes.root}/>
};