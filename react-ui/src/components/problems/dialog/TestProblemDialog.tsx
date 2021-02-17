import { makeStyles, Dialog, TextField, AppBar, Toolbar, IconButton, Typography, List, ListItem } from "@material-ui/core";
import React, { useEffect } from "react";
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { CommitId } from "../../../models/Identificators";
import ProblemView from "../../train/ProblemView";
import { GeneratedProblemModel } from "../../../models/domain";
import { View } from "../../../protobuf/domain_pb";

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    list: {
        width: '100%',
    },
    inputLabel: {
        minWidth: 120,
    }
}));

export interface ITestProblemDialogParameters {
    open: boolean;
    seed: number;
    data: {
        loading: 'idle' | 'pending'
    } | {
        loading: 'succeeded',
        seed: number,
        problem: GeneratedProblemModel;
    },
    answer: string;
    isCorrect: boolean | null;
    commitId: CommitId | null;
}

export interface ITestProblemDialogActions {
    generate(seed: number, commitId: CommitId): void;
    validate(commitId: CommitId, expected: string, actual: string): void;
    close(): void;
    updateSeed(seed: number): void;
    updateAnswer(answer: string): void;
}

export interface ITestProblemDialogProps extends ITestProblemDialogActions, ITestProblemDialogParameters {
}

export default function TestProblemDialog(props: ITestProblemDialogProps) {

    useEffect(() => {
        if (props.data.loading === 'idle' && props.commitId !== null) {
            props.generate(props.seed, props.commitId);
        }
    });

    const onUpdate = () => {
        if (props.commitId !== null) {
            props.generate(props.seed, props.commitId);
        }
    }

    const onValidate = async () => {
        if (props.commitId !== null && props.data.loading === 'succeeded') {
            props.validate(props.commitId, props.data.problem.answer, props.answer);
        }
    };

    const classes = useStyles();

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
                        onClick={props.close}>
                        <CloseIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Test your problem
                    </Typography>
                </Toolbar>
            </AppBar>
            <List
                className={classes.list}>
                <ListItem>
                    <TextField
                        className={classes.inputLabel}
                        label="Seed"
                        value={props.seed}
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            props.updateSeed(Number.isNaN(value) ? 0 : value);
                        }} />
                        <IconButton 
                            edge="end"
                            color="inherit"
                            onClick={onUpdate}>
                            <RefreshIcon />
                        </IconButton>
                    </ListItem>
                <ListItem>
                    {props.data.loading === 'succeeded' ? <ProblemView view={props.data.problem.view ?? { language: View.Language.PLAIN_TEXT, content: "" }} /> : null}
                </ListItem>
                <ListItem>
                    <Typography variant="body1">
                        Expected answer: {props.data.loading === 'succeeded' ? props.data.problem.answer : ""}
                    </Typography>
                </ListItem>
                <ListItem>
                    <TextField
                        className={classes.inputLabel}
                        label="Test answer"
                        value={props.answer}
                        onChange={(e) => props.updateAnswer(e.target.value)} />
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={onValidate}>
                            <PlayArrowIcon />
                        </IconButton>
                </ListItem>
                <ListItem>
                    <Typography variant="body1">
                        Result: {props.isCorrect === null ? "" : (props.isCorrect ? "Correct" : "Incorrect")}
                    </Typography>
                </ListItem>
            </List>
        </Dialog>
    );
};