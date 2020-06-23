import { makeStyles, Dialog, AppBar, Toolbar, IconButton, Typography, List, ListItem, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";
import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import { Report } from "../../models/Report";
import ReportProblemView from "./ReportProblemView";
import ReportProblemSetView from "./ReportProblemSetView";
import TimeSpanView from "../utils/TimeSpanView";

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    list: {
        margin: "auto",
        width: '60%',
    },
    inputLabel: {
        minWidth: 120,
    },
    fieldLabel: {
        fontSize: 14,
    },
    tableHeaderCell: {
        fontWeight: "bold"
    },
    correctStatus: {
        color: "green"
    },
    wrongStatus: {
        color: "red"
    }
    
}));

export interface IReportDialogProps {
    open: boolean;
    onClose: () => void;
    report: Report;
}

function StatusView(props: { isCorrect: boolean; }) {

    const classes = useStyles();

    if (props.isCorrect) {
        return (
            <Typography
                className={classes.correctStatus}
                variant="body2">
                Correct
            </Typography>
        );
    } else {
        return (
            <Typography
                className={classes.wrongStatus}
                variant="body2">
                Wrong
            </Typography>
        );
    }
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
                <ListItem key="problem_set_table_report">
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tableHeaderCell}>#</TableCell>
                                    <TableCell className={classes.tableHeaderCell} align="right">Title</TableCell>
                                    <TableCell className={classes.tableHeaderCell} align="right">Answer timestamp</TableCell>
                                    <TableCell className={classes.tableHeaderCell} align="right">User answer</TableCell>
                                    <TableCell className={classes.tableHeaderCell} align="right">Expected answer</TableCell>
                                    <TableCell className={classes.tableHeaderCell} align="right">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {
                                props.report.problem_set.problems.map((problem, index) =>
                                    {
                                        return (
                                            <TableRow key={"problem_" + problem.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell align="right">{problem.title}</TableCell>
                                                <TableCell align="right">
                                                    {problem.timestamp ? (<TimeSpanView fromDate={props.report.started_at} toDate={problem.timestamp}/>) : "Skipped"}
                                                </TableCell>
                                                <TableCell align="right">{problem.answer ? problem.answer : "Skipped"}</TableCell>
                                                <TableCell align="right">{problem.expected_answer}</TableCell>
                                                <TableCell align="right">
                                                    <StatusView isCorrect={problem.is_correct} />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                )
                            }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ListItem>
                {
                    props.report.problem_set.problems.map((problem, index) =>
                        {
                            return (
                                <ListItem
                                    key={"problem_" + problem.id}
                                    >
                                    <ReportProblemView
                                        index={index + 1}
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