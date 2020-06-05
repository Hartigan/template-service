import * as React from 'react'
import { makeStyles, List, ListItem } from '@material-ui/core';
import { ExaminationService } from '../../services/ExaminationService';
import { Report } from '../../models/Report';
import ReportPreviewView from './ReportPreviewView';
import { UserService } from '../../services/UserService';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    }
}));

export interface IReportsListViewProps {
    examinationService: ExaminationService;
    userService: UserService;
    reports: Array<Report>;
};

export default function ReportsListView(props: IReportsListViewProps) {

    const classes = useStyles();

    return (
        <List className={classes.root}>
            {
                props.reports.map(report => (
                    <ListItem
                        key={"report_" + report.id}
                        >
                        <ReportPreviewView
                            examinationService={props.examinationService}
                            userService={props.userService}
                            preview={report}
                            />
                    </ListItem>
                ))
            }
        </List>
    );
}