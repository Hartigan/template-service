import { makeStyles, Button, Card, CardContent, Typography, CardActions } from "@material-ui/core";
import React from "react";
import { ExaminationService } from "../../services/ExaminationService";
import DateView from "../utils/DateView";
import { Report } from "../../models/Report";
import ReportDialog from "../common/ReportDialog";
import { UserService } from "../../services/UserService";
import ShareReportDialog from "./ShareReportDialog";

const useStyles = makeStyles(theme => ({
    root: {
        width: 320,
        flexGrow: 1,
        margin: "8px"
    },
    title: {
        fontSize: 14,
    },
}));

interface IState {
    reportOpened: boolean;
    shareOpened: boolean;
}

export interface IReportPreviewViewProps {
    preview: Report;
    examinationService: ExaminationService;
    userService: UserService;
}

export default function ReportPreviewView(props: IReportPreviewViewProps) {

    const [ state, setState ] = React.useState<IState>({
        reportOpened: false,
        shareOpened: false
    });

    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Title
                </Typography>
                <Typography variant="h5" component="h2">
                    {props.preview.problem_set.title}
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    User
                </Typography>
                <Typography variant="body2" component="p">
                    {props.preview.author.username}
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Started at
                </Typography>
                <DateView date={props.preview.started_at} />
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Finished at
                </Typography>
                <DateView date={props.preview.started_at} />
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
                    onClick={() => setState({ ...state, shareOpened: true })}
                    >
                    Share
                </Button>
                <ShareReportDialog
                    open={state.shareOpened}
                    reportId={props.preview.id}
                    userService={props.userService}
                    examinationService={props.examinationService}
                    onClose={() => setState({ ...state, shareOpened: false })}
                    />
                <ReportDialog 
                    open={state.reportOpened}
                    report={props.preview}
                    onClose={() => setState({ ...state, reportOpened: false })}
                    />
            </CardActions>
        </Card>
    );
};