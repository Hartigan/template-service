import { makeStyles, Dialog, AppBar, Toolbar, IconButton, Typography, List, ListItem, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";
import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import ReportProblemView from "./ReportProblemView";
import ReportProblemSetView from "./ReportProblemSetView";
import TimeSpanView from "../utils/TimeSpanView";
import StatusView from "./StatusView";
import { ReportModel } from "../../models/domain";

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    list: {
        width: '60%',
        minWidth: "360px",
        margin: "auto",
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
}));

export interface IReportDialogProps {
    open: boolean;
    onClose: () => void;
    report: ReportModel;
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
                                props.report.problemSet?.problemsList?.map((problem, index) =>
                                    {
                                        return (
                                            <TableRow key={"problem_" + problem.generatedProblemId}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell align="right">{problem.title}</TableCell>
                                                <TableCell align="right">
                                                    {problem.userAnswer?.timestamp ? (<TimeSpanView fromDate={new Date(props.report.startedAt)} toDate={new Date(problem.userAnswer?.timestamp)}/>) : "Skipped"}
                                                </TableCell>
                                                <TableCell align="right">{problem.userAnswer?.value ?? "Skipped"}</TableCell>
                                                <TableCell align="right">{problem.expectedAnswer}</TableCell>
                                                <TableCell align="right">
                                                    <StatusView isCorrect={problem.isCorrect} />
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
                    props.report.problemSet?.problemsList?.map((problem, index) =>
                        {
                            return (
                                <ListItem
                                    key={"problem_" + problem.generatedProblemId}
                                    >
                                    <ReportProblemView
                                        index={index + 1}
                                        startTime={new Date(props.report.startedAt)}
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