import * as React from 'react'
import { makeStyles, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { ExaminationService } from '../../services/ExaminationService';
import { Report } from '../../models/Report';
import ReportPreviewView from './ReportPreviewView';
import { UserService } from '../../services/UserService';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    tableHeaderCell: {
        fontWeight: "bold"
    },
}));

export interface IReportsListViewProps {
    examinationService: ExaminationService;
    userService: UserService;
    reports: Array<Report>;
};

export default function ReportsListView(props: IReportsListViewProps) {

    const classes = useStyles();

    return (
        <TableContainer
            className={classes.root}
            component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableHeaderCell} align="right">Title</TableCell>
                        <TableCell className={classes.tableHeaderCell} align="right">Author</TableCell>
                        <TableCell className={classes.tableHeaderCell} align="right">Started at</TableCell>
                        <TableCell className={classes.tableHeaderCell} align="right">Finished at</TableCell>
                        <TableCell className={classes.tableHeaderCell} align="right">Result</TableCell>
                        <TableCell className={classes.tableHeaderCell} align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {
                    props.reports.map(report => (
                        <ReportPreviewView
                            key={"report_" + report.id}
                            examinationService={props.examinationService}
                            userService={props.userService}
                            preview={report}
                            />
                    ))
                }
                </TableBody>
            </Table>
            
        </TableContainer>
    );
}