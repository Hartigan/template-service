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
});

export interface ITagsViewProps {
    tags: Array<string>;
}

export default function TagsView(props: ITagsViewProps) {

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
                            />
                    );
                })
            }
        </div>
    );
}