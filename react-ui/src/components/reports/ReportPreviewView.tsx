import { makeStyles, Button, TableRow, TableCell } from "@material-ui/core";
import React from "react";
import { ExaminationService } from "../../services/ExaminationService";
import DateView from "../utils/DateView";
import { Report } from "../../models/Report";
import ReportDialog from "../common/ReportDialog";
import { UserService } from "../../services/UserService";
import ShareReportDialog from "./ShareReportDialog";

const useStyles = makeStyles(theme => ({
    row: {
    }
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
        <TableRow className={classes.row}>
            <TableCell align="right">{props.preview.problem_set.title}</TableCell>
            <TableCell align="right">{props.preview.author.username}</TableCell>
            <TableCell align="right">
                <DateView date={props.preview.started_at} />
            </TableCell>
            <TableCell align="right">
                <DateView date={props.preview.finished_at} />
            </TableCell>
            <TableCell align="right">
            {props.preview.problem_set.problems.map(x => (x.is_correct ? 1 : 0) as number).reduce((sum, x) => sum + x)} of {props.preview.problem_set.problems.length}
            </TableCell>
            <TableCell align="right">
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
            </TableCell>
        </TableRow>
    );
};