import { makeStyles, Typography, Card, CardActionArea, CardContent } from "@material-ui/core";
import React from "react";
import { Report } from "../../models/Report";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
    header: {
        width: "100%",
    },
    content: {
        width: "100%",
    },
    title: {
        fontSize: 14,
    },
}));

interface IState {
}

export interface IReportProblemSetViewProps {
    report: Report;
}

export default function ReportProblemSetView(props: IReportProblemSetViewProps) {

    const [ state, setState ] = React.useState<IState>({
    }); 

    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardContent>
                    <Typography variant="h5">
                        {props.report.problem_set.title}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Author
                    </Typography>
                    <Typography variant="body2" component="p">
                        {props.report.author.username}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Started at
                    </Typography>
                    <Typography variant="body2" component="p">
                        {props.report.started_at}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Finished at
                    </Typography>
                    <Typography variant="body2" component="p">
                        {props.report.finished_at}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};