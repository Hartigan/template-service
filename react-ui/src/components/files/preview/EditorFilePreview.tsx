import { makeStyles, Paper } from "@material-ui/core";
import React, { useEffect } from "react";
import { Head } from "../../../models/Head";
import TagsEditorView from "../../utils/TagsEditorView";
import { HeadLink } from "../../../models/Folder";
import { HeadId } from "../../../models/Identificators";
import ProblemSetPreviewContainer from "../../problem_sets/preview/ProblemSetPreviewContainer";
import ProblemEditorContainer from "../../problems/editor/ProblemEditorContainer";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
}));

export interface IEditorFilePreviewParameters {
    current: HeadLink | null;
    data: {
        head: Head;
        loading: 'succeeded';
    } | {
        loading: 'idle' | 'pending' | 'failed';
    }
};

export interface IEditorFilePreviewActions {
    fetchHead: (headId: HeadId) => void;
    updateTags: (headId: HeadId, tags: Array<string>) => void;
};

export interface IEditorFilePreviewProps extends IEditorFilePreviewActions, IEditorFilePreviewParameters {
}

export default function EditorFilePreview(props: IEditorFilePreviewProps) {

    useEffect(() => {
        if (props.current === null) {
            return;
        }
        if (props.data.loading === 'idle' ||
        (props.data.loading === 'succeeded' && props.current.id !== props.data.head.id)) {
            props.fetchHead(props.current.id);
        }
    });

    const classes = useStyles();

    const getHeadView = () => {
        if (props.data.loading !== 'succeeded') {
            return <div/>;
        }

        const head = props.data.head;

        switch (head.commit.target.type) {
            case "problem":
                return (
                    <ProblemEditorContainer />
                );
            case "problem_set":
                return (
                    <ProblemSetPreviewContainer />
                );
        }
    };

    const getTagsEditor = () => {

        if (props.data.loading !== 'succeeded') {
            return <div/>;
        }

        const onRemove = (tag: string) => {
            if (props.data.loading !== 'succeeded') {
                return;
            }
            props.updateTags(props.data.head.id, props.data.head.tags.filter(x => x !== tag));
        };

        const onAdd = async (tag: string) => {
            if (props.data.loading !== 'succeeded' || !tag) {
                return;
            }
            const tags = [ ...props.data.head.tags, tag ];
            
            props.updateTags(props.data.head.id, tags);
        };

        return (
            <TagsEditorView
                tags={props.data.head.tags}
                onAdd={onAdd}
                onRemove={onRemove}
                />
        );
    };

    return (
        <Paper className={classes.root}>
            {getTagsEditor()}
            {getHeadView()}
        </Paper>
    );
};