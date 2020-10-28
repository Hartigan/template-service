import { makeStyles, Dialog, Button, AppBar, Toolbar, IconButton, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import CloseIcon from '@material-ui/icons/Close';
import { ProblemSet } from "../../models/ProblemSet";
import ProblemSetEditor from "./ProblemSetEditorView";
import { FolderLink } from "../../models/Folder";
import { problemSetService } from "../../Services";

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

interface IState {
    problemSet: ProblemSet;
}

export interface ICreateProblemSetDialogProps {
    open: boolean;
    onClose: () => void;
    currentFolder: FolderLink;
}

export default function CreateProblemSetDialog(props: ICreateProblemSetDialogProps) {

    const [ state, setState ] = React.useState<IState>({
        problemSet: {
            id: "",
            title: "",
            duration: 0,
            slots: []
        }
    })

    const clean = () => {
        setState({
            ...state,
            problemSet: {
                id: "",
                title: "",
                duration: 0,
                slots: []
            }
        });
    };

    useEffect(() => {
        return () => {
        };
    });

    const onCancel = () => {
        clean();
        props.onClose();
    };

    const onUpdate = (problemSet: ProblemSet) => {
        setState({
            ...state,
            problemSet: problemSet
        })
    };

    const onSave = async () => {
        await problemSetService.create(props.currentFolder.id, state.problemSet.title, state.problemSet);
        clean();
        props.onClose();
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
            <ProblemSetEditor
                problemSet={state.problemSet}
                onUpdate={onUpdate}
                />
        </Dialog>
    );
};