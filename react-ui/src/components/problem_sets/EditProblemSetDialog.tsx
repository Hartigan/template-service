import { makeStyles, Dialog, TextField, Button, AppBar, Toolbar, IconButton, Typography, List, ListItem, FormControl } from "@material-ui/core";
import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import { ProblemSet } from "../../models/ProblemSet";
import { HeadId } from "../../models/Identificators";
import ProblemSetEditor from "./ProblemSetEditorView";
import { problemSetService } from "../../Services";

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    formList: {
        width: '100%',
    },
    form: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

interface IState {
    commitDescription: string;
    problemSet: ProblemSet;
}

export interface IEditProblemSetDialogProps {
    open: boolean;
    headId: HeadId;
    problemSet: ProblemSet;
    onClose: () => void;
}

export default function EditProblemSetDialog(props: IEditProblemSetDialogProps) {
    const [ state, setState ] = React.useState<IState>({
        commitDescription: "",
        problemSet: props.problemSet
    });

    const clean = () => {
        setState({
            ...state,
            commitDescription: "",
            problemSet: props.problemSet
        });
    };

    const onCancel = () => {
        clean();
        props.onClose();
    };

    const onSave = async () => {
        await problemSetService.update(props.headId, state.commitDescription, state.problemSet);

        clean();
        props.onClose();
    };

    const setCommitDescription = (desc: string) => {
        setState({
            ...state,
            commitDescription: desc,
        });
    };

    const onUpdate = (problemSet: ProblemSet) => {
        setState({
            ...state,
            problemSet: problemSet
        });
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
                        onClick={onCancel}>
                        <CloseIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Problem set
                    </Typography>
                    <Button
                        autoFocus
                        color="inherit"
                        onClick={onSave}>
                        Save
                    </Button>
                </Toolbar>
            </AppBar>
            <List
                className={classes.formList}>
                <ListItem>
                    <FormControl className={classes.form}>
                        <TextField
                            label="Commit description"
                            value={state.commitDescription}
                            onChange={(e) => setCommitDescription(e.target.value)} />
                    </FormControl>
                </ListItem>
            </List>
            <ProblemSetEditor
                problemSet={state.problemSet}
                onUpdate={onUpdate}
                />
        </Dialog>
    );
};