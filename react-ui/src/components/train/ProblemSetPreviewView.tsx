import { makeStyles, Button, Card, CardContent, Typography, CardActions } from "@material-ui/core";
import React from "react";
import { HeadModel, ProblemSetPreviewModel } from "../../models/domain";
import { HeadId } from "../../models/Identificators";
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
    head: HeadModel;
    preview: ProblemSetPreviewModel;
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
                    <TagsView tags={props.head.tagsList} />
                </div>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Duration
                </Typography>
                <Typography variant="body2" component="p">
                    {props.preview.durationS / 60}
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Problems count
                </Typography>
                <Typography variant="body2" component="p">
                    {props.preview.problemsCount}
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Author
                </Typography>
                <Typography variant="body2" component="p">
                    {props.preview.author?.username}
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