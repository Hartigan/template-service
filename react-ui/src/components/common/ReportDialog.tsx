import { makeStyles, Dialog, AppBar, Toolbar, IconButton, Typography, List, ListItem } from "@material-ui/core";
import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import { Report } from "../../models/Report";
import ReportProblemView from "./ReportProblemView";
import ReportProblemSetView from "./ReportProblemSetView";

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    list: {
        width: '100%',
    },
    inputLabel: {
        minWidth: 120,
    },
    fieldLabel: {
        fontSize: 14,
    },
}));

export interface IReportDialogProps {
    open: boolean;
    onClose: () => void;
    report: Report;
}

export default function ReportDialog(props: IReportDialogProps) {

    const onCancel = () => {
        props.onClose();
    };

    const classes = useStyles();

    return (
        <Dialog
            open={props.open}
            fullScreen>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="close"
                        onClick={onCancel}>
                        <CloseIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Report
                    </Typography>
                </Toolbar>
            </AppBar>
            <List
                className={classes.list}>
                <ListItem key="problem_set">
                    <ReportProblemSetView report={props.report} />
                </ListItem>
                {
                    props.report.problem_set.problems.map(problem =>
                        {
                            return (
                                <ListItem
                                    key={"problem_" + problem.id}
                                    >
                                    <ReportProblemView
                                        startTime={props.report.started_at}
                                        problem={problem}
                                        />
                                </ListItem>
                            )
                        }
                    )
                }
            </List>
        </Dialog>
    );
};