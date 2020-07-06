import { makeStyles, Chip, InputBase } from "@material-ui/core";
import React from "react";
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles({
    root: {
        width: "100%",
        padding: "10px"
    },
    chip: {
        margin: "3px"
    },
    newTagInput: {
    }
});

interface IState {
    newTag: string;
}

export interface ITagsEditorViewProps {
    tags: Array<string>;
    onRemove: (tag: string) => void;
    onAdd: (tag: string) => void;
    placeholderText?: string;
}

export default function TagsEditorView(props: ITagsEditorViewProps) {

    const [ state, setState ] = React.useState<IState>({
        newTag: ""
    });

    const classes = useStyles();

    return (
        <div className={classes.root}>
            { 
                props.tags.map(tag => {
                    return (
                        <Chip
                            key={`tag_${tag}`}
                            className={classes.chip}
                            variant="outlined"
                            size="medium"
                            color="primary"
                            label={tag}
                            onDelete={() => props.onRemove(tag)}
                            />
                    );
                })
            }
            <Chip
                key={`tag_new`}
                variant="outlined"
                className={classes.chip}
                size="medium"
                color="primary"
                label={<InputBase
                            className={classes.newTagInput}
                            placeholder={props.placeholderText ?? "new tag" }
                            onChange={(e) => setState({ ...state, newTag: e.target.value })}
                            value={state.newTag}
                        />}
                deleteIcon={<AddIcon />}
                onDelete={() => { props.onAdd(state.newTag); setState({ ...state, newTag: "" }) }}
                />
        </div>
    );
}