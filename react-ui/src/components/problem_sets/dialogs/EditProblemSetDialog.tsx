import { makeStyles, Dialog, TextField, Button, AppBar, Toolbar, IconButton, Typography, List, ListItem, FormControl } from "@material-ui/core";
import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import { HeadId } from "../../../models/Identificators";
import ProblemSetEditorContainer from "../editor/ProblemSetEditorContainer";
import { ProblemSetModel } from "../../../models/domain";

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

export interface IEditProblemSetDialogParameters {
    open: boolean;
    commitDescription: string;
    problemSet: ProblemSetModel | null;
    saving: 'idle' | 'pending' | 'succeeded';
    headId: HeadId | null;
};

export interface IEditProblemSetDialogActions {
    saveProblemSet(headId: HeadId, problemSet: ProblemSetModel, desc: string) : void;
    cancel() : void;
    updateProblemSet(problemSet: ProblemSetModel) : void;
    updateDescription(desc: string) : void;
    updateHead(headId: HeadId): void;
};

export interface IEditProblemSetDialogProps extends IEditProblemSetDialogActions, IEditProblemSetDialogParameters {
};

export default function EditProblemSetDialog(props: IEditProblemSetDialogProps) {

    const classes = useStyles();

    const onSave = () => {
        if (props.headId && props.problemSet) {
            props.saveProblemSet(props.headId, props.problemSet, props.commitDescription);
            props.updateHead(props.headId);
            
        }
    };

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
                        onClick={props.cancel}>
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
                            value={props.commitDescription}
                            onChange={(e) => props.updateDescription(e.target.value)} />
                    </FormControl>
                </ListItem>
            </List>
            <ProblemSetEditorContainer />
        </Dialog>
    );
};