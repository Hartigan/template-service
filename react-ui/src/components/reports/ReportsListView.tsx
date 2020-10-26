import * as React from 'react'
import { makeStyles, Box } from '@material-ui/core';
import { Report } from '../../models/Report';
import ReportPreviewView from './ReportPreviewView';
import { ReportId } from '../../models/Identificators';

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
    reports: Array<Report>;
    onOpenShare: (reportId: ReportId) => void;
    onOpenReport: (report: Report) => void;
};

export default function ReportsListView(props: IReportsListViewProps) {

    const classes = useStyles();

    return (
        <Box className={classes.root} flexWrap="wrap">
            {
                props.reports.map(report => (
                    <ReportPreviewView
                        key={"report_" + report.id}
                        preview={report}
                        onOpenReport={props.onOpenReport}
                        onOpenShare={props.onOpenShare}
                        />
                ))
            }
        </Box>
    );
}