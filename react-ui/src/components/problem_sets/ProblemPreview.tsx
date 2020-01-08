import { makeStyles, Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import { Problem } from "../../models/Problem";

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 200,
        textAlign: "left",
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
}));

export interface IProblemPreviewProps {
    problem: Problem;
}

export default function ProblemPreview(props: IProblemPreviewProps) {

    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Title
                </Typography>
                <Typography variant="h5" component="h2">
                    {props.problem.title}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                    View
                </Typography>
                <Typography variant="body2" component="p">
                    {props.problem.view.content}
                </Typography>
            </CardContent>
        </Card>
    );
};