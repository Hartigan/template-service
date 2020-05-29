import { makeStyles, Card, CardContent, Typography, CardActions, Button } from "@material-ui/core";
import React from "react";
import { ExaminationService } from "../../services/ExaminationService";
import DateView from "../utils/DateView";
import { Report } from "../../models/Report";
import ReportDialog from "../common/ReportDialog";

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
    reportOpened: boolean;
}

export interface IReportPreviewViewProps {
    preview: Report;
    examinationService: ExaminationService;
}

export default function ReportPreviewView(props: IReportPreviewViewProps) {

    const [ state, setState ] = React.useState<IState>({
        reportOpened: false
    });

    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <ReportDialog 
                    open={state.reportOpened}
                    report={props.preview}
                    onClose={() => setState({ ...state, reportOpened: false })}
                    />
                <Typography gutterBottom variant="h5" component="h2">
                    {props.preview.problem_set.title}
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Author
                </Typography>
                <Typography variant="body2" component="p">
                    {props.preview.author.username}
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Started at
                </Typography>
                <Typography variant="body2" component="p">
                    <DateView date={props.preview.started_at} />
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Finished at
                </Typography>
                <Typography variant="body2" component="p">
                    <DateView date={props.preview.finished_at} />
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Result
                </Typography>
                <Typography variant="body2" component="p">
                    {props.preview.problem_set.problems.map(x => (x.is_correct ? 1 : 0) as number).reduce((sum, x) => sum + x)} of {props.preview.problem_set.problems.length}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    onClick={() => setState({ ...state, reportOpened: true })}
                    >
                    View report
                </Button>
                <Button
                    size="small"
                    color="primary"
                    onClick={() => {}}
                    >
                    Share
                </Button>
            </CardActions>
        </Card>
    );
};