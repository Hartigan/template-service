import { makeStyles, Paper } from "@material-ui/core";
import React, { useEffect } from "react";
import ProblemEditor from "../problems/ProblemEditor";
import ProblemSetPreview from "../problem_sets/ProblemSetPreview";
import { Head } from "../../models/Head";
import TagsEditorView from "../utils/TagsEditorView";
import { HeadLink } from "../../models/Folder";
import { versionService } from "../../Services";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
}));

interface IState {
    head: Head | null;
}

export interface IFilePreviewProps {
    current: HeadLink | null;
}

export default function FilePreview(props: IFilePreviewProps) {

    const [ state, setState ] = React.useState<IState>({
        head: null
    });

    useEffect(() => {
        if (!props.current || props.current.id === state.head?.id) {
            return;
        }

        let canUpdate = true;
        versionService
            .getHead(props.current.id)
            .then(head => {
                if (canUpdate) {
                    setState({
                        ...state,
                        head: head
                    })
                }
            });

        return () => {
            canUpdate = false;
        };
    })

    const onSync = () => {
        setState({
            ...state,
            head: null
        });
    };

    const classes = useStyles();

    const getHeadView = () => {
        if (state.head) {
            switch (state.head.commit.target.type) {
                case "problem":
                    return (
                        <ProblemEditor
                            commit={state.head.commit}
                            onSync={onSync}
                            />
                    );
                case "problem_set":
                    return (
                        <ProblemSetPreview
                            commit={state.head.commit}
                            onSync={onSync}
                            />
                    );
            }
        }
    };

    const getTagsEditor = () => {
        if (state.head) {
            const onRemove = async (tag: string) => {
                if (state.head === null) {
                    return;
                }
                await versionService.updateTags(state.head.id, state.head.tags.filter(x => x !== tag))
                onSync();
            };

            const onAdd = async (tag: string) => {
                if (state.head === null || !tag) {
                    return;
                }
                const tags = [ ...state.head.tags, tag ];
                await versionService.updateTags(state.head.id, tags);
                onSync();
            };

            return (
                <TagsEditorView
                    tags={state.head.tags}
                    onAdd={onAdd}
                    onRemove={onRemove}
                    />
            );
        }
        else {
            return (
                <div/>
            )
        }
    };

    return (
        <Paper className={classes.root}>
            {getTagsEditor()}
            {getHeadView()}
        </Paper>
    );
};