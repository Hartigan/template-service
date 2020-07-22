import { makeStyles, Chip, Typography, Box } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
    root: {
        width: "100%",
        minHeight: "32px"
    },
    chip: {
        margin: "0px 3px 0px 3px"
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
            {props.tags.length === 0
                ? (
                    <Typography color="textPrimary" component="div">
                        <Box fontStyle="italic">
                            no tags
                        </Box>
                    </Typography>
                ) : null
            }
        </div>
    );
}