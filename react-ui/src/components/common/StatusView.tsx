import { makeStyles, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(theme => ({
    correctStatus: {
        color: "green"
    },
    wrongStatus: {
        color: "red"
    }
    
}));

export default function StatusView(props: { isCorrect: boolean; }) {

    const classes = useStyles();

    if (props.isCorrect) {
        return (
            <Typography
                className={classes.correctStatus}
                variant="body2"
                component="span">
                Correct
            </Typography>
        );
    } else {
        return (
            <Typography
                className={classes.wrongStatus}
                variant="body2"
                component="span">
                Wrong
            </Typography>
        );
    }
}
