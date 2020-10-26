import { makeStyles, Button, Card, CardContent, Typography, CardActions } from "@material-ui/core";
import React from "react";
import { HeadId } from "../../models/Identificators";
import { ProblemSetPreview } from "../../models/ProblemSetPreview";
import { Head } from "../../models/Head";
import TagsView from "../utils/TagsView";


const useStyles = makeStyles(theme => ({
    root: {
        width: 320,
        flexGrow: 1,
        margin: "8px"
    },
    title: {
        fontSize: 14,
    },
    tags: {
        margin: "8px 0px 8px 0px"
    }
}));

export interface IProblemSetPreviewViewProps {
    head: Head;
    preview: ProblemSetPreview;
    onStartSubmission: (headId: HeadId) => void;
}

export default function ProblemSetPreviewView(props: IProblemSetPreviewViewProps) {

    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Title
                </Typography>
                <Typography variant="h5" component="h2">
                    {props.preview.title}
                </Typography>
                <div className={classes.tags}>
                    <TagsView tags={props.head.tags} />
                </div>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Duration
                </Typography>
                <Typography variant="body2" component="p">
                    {props.preview.duration / 60}
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Problems count
                </Typography>
                <Typography variant="body2" component="p">
                    {props.preview.problems_count}
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Author
                </Typography>
                <Typography variant="body2" component="p">
                    {props.preview.author.username}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    onClick={() => props.onStartSubmission(props.head.id)}
                    >
                    Start
                </Button>
            </CardActions>
        </Card>
    );
};