import { makeStyles, Dialog, Button, AppBar, Toolbar, IconButton, Typography } from "@material-ui/core";
import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import { ProblemSet } from "../../../models/ProblemSet";
import { FolderId } from "../../../models/Identificators";
import ProblemSetCreatorContainer from "../editor/ProblemSetCreatorContainer";

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

export interface ICreateProblemSetDialogParameters {
    open: boolean;
    data: {
        problemSet: ProblemSet
    } | null;
    creating: 'idle' | 'pending' | 'succeeded';
    folderId: FolderId | null;
};

export interface ICreateProblemSetDialogActions {
    createProblemSet(folderId: FolderId, title: string, problemSet: ProblemSet): void;
    cancel(): void;
}

export interface ICreateProblemSetDialogProps extends ICreateProblemSetDialogParameters, ICreateProblemSetDialogActions {
};

export default function CreateProblemSetDialog(props: ICreateProblemSetDialogProps) {

    const classes = useStyles();

    if (props.data === null) {
        return <div/>
    }

    const onSave = () => {
        if (props.data !== null && props.folderId !== null) {
            props.createProblemSet(props.folderId, props.data.problemSet.title, props.data.problemSet);
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
            <ProblemSetCreatorContainer />
        </Dialog>
    );
};