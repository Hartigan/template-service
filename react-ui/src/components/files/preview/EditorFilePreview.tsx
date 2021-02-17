import { makeStyles, Paper } from "@material-ui/core";
import React, { useEffect } from "react";
import TagsEditorView from "../../utils/TagsEditorView";
import { HeadId } from "../../../models/Identificators";
import ProblemSetPreviewContainer from "../../problem_sets/preview/ProblemSetPreviewContainer";
import ProblemEditorContainer from "../../problems/editor/ProblemEditorContainer";
import { HeadLinkModel, HeadModel } from "../../../models/domain";
import { TargetModel } from "../../../protobuf/domain_pb";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
}));

export interface IEditorFilePreviewParameters {
    current: HeadLinkModel | null;
    data: {
        head: HeadModel;
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

        switch (head.commit?.target?.type) {
            case TargetModel.ModelType.PROBLEM:
                return (
                    <ProblemEditorContainer />
                );
            case TargetModel.ModelType.PROBLEMSET:
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
            props.updateTags(props.data.head.id, props.data.head.tagsList.filter(x => x !== tag));
        };

        const onAdd = async (tag: string) => {
            if (props.data.loading !== 'succeeded' || !tag) {
                return;
            }
            const tags = [ ...props.data.head.tagsList, tag ];
            
            props.updateTags(props.data.head.id, tags);
        };

        return (
            <TagsEditorView
                tags={props.data.head.tagsList}
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