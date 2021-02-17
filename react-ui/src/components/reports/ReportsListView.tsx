import * as React from 'react'
import { makeStyles, Box } from '@material-ui/core';
import ReportPreviewView from './ReportPreviewView';
import { ReportId } from '../../models/Identificators';
import { ReportModel } from '../../models/domain';

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
    reports: Array<ReportModel>;
    onOpenShare: (reportId: ReportId) => void;
    onOpenReport: (report: ReportModel) => void;
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