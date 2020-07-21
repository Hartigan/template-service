import * as React from 'react'
import { makeStyles, Box } from '@material-ui/core';
import { ExaminationService } from '../../services/ExaminationService';
import { Report } from '../../models/Report';
import ReportPreviewView from './ReportPreviewView';
import { UserService } from '../../services/UserService';

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
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
        <Box className={classes.root} flexWrap="wrap">
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
        </Box>
    );
}