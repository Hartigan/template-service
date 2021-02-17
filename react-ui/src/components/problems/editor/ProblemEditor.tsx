import { makeStyles, List, ListItem, FormControl, TextField, Container, IconButton, Box } from "@material-ui/core";
import React, { useEffect } from "react";
import ControllerEditor from "../ControllerEditor";
import ViewEditor from "../ViewEditor";
import ValidatorEditor from "../ValidatorEditor";
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import BugReportIcon from '@material-ui/icons/BugReport';
import { HeadId } from "../../../models/Identificators";
import TestProblemDialogContainer from "../dialog/TestProblemDialogContainer";
import { AccessModel, CommitModel, ControllerModel, ProblemModel, ValidatorModel, ViewModel } from "../../../models/domain";
import { Controller, Validator, View } from "../../../protobuf/domain_pb";

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
        commit: CommitModel;
        problem: ProblemModel;
        access: AccessModel;
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
        commit: CommitModel;
        problem: ProblemModel;
        access: AccessModel;
    },
    updating: 'idle' | 'pending';
    headId: HeadId | null;
}

export interface IProblemEditorActions {
    fetchProblem(headId: HeadId): void;
    saveProblem(headId: HeadId, description: string, problem: ProblemModel): void;
    updateTitle(title: string): void;
    updateController(controller: ControllerModel): void;
    updateView(view: ViewModel): void;
    updateValidator(validator: ValidatorModel): void;
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

        if (props.data.loading === 'idle' || (props.data.loading === 'succeeded' && props.data.commit.headId !== props.headId)) {
            props.fetchProblem(props.headId);
        }
    });

    const classes = useStyles();

    const onSave = () => {
        if (props.data.loading === 'succeeded') {
            props.saveProblem(props.data.commit.headId, props.description, props.data.problem);
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
                            value={props.data.problem.controller ?? { language: Controller.Language.C_SHARP, content: "" }}
                            onChange={props.updateController}
                            disabled={props.disabled} />
                    </ListItem>
                    <ListItem>
                        <ViewEditor
                            value={props.data.problem.view ?? { language: View.Language.PLAIN_TEXT, content: "" }}
                            onChange={props.updateView}
                            disabled={props.disabled} />
                    </ListItem>
                    <ListItem>
                        <ValidatorEditor
                            value={props.data.problem.validator ?? { language: Validator.Language.C_SHARP, content: "" }}
                            onChange={props.updateValidator}
                            disabled={props.disabled} />
                    </ListItem>
                </List>
            </Box>
        );
    else
        return <Box className={classes.root}/>
};