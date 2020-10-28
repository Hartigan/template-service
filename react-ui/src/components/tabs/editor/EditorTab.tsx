import { makeStyles, Grid } from "@material-ui/core";
import React from "react";
import { useDispatch } from 'react-redux';
import FileTreeView from "../../files/FileTreeView";
import FilePreview from "../../files/FilePreview";
import { HeadLink } from "../../../models/Folder";
import { selectHead } from "./EditorTabSlice";

const treeWidth = 320;

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
    tree: {
        width: `${treeWidth}px`,
        height: "100%",
    },
    content: {
        width: `calc(100% - ${treeWidth}px)`,
        height: "100%",
    },
}));

export interface IEditorTabProps {
    selectedHead: HeadLink | null;
}

export default function EditorTab(props: IEditorTabProps) {

    const dispatch = useDispatch();

    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <Grid item className={classes.tree}>
                <FileTreeView
                    selected={props.selectedHead}
                    onSelect={(v) => dispatch(selectHead(v))}
                    />
            </Grid>
            <Grid item className={classes.content}>
                <FilePreview
                    current={props.selectedHead}
                    />
            </Grid>
        </Grid>
    );
};