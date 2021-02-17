import * as React from 'react'
import { makeStyles, List, ListItem } from '@material-ui/core';
import ReportLabelView from './ReportLabelView';
import { ReportModel } from '../../../models/domain';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    }
}));

export interface IReportsListViewProps {
    reports: Array<ReportModel>;
    onSelect: (link: ReportModel) => void;
    selected: ReportModel | null;
};

export default function ReportsListView(props: IReportsListViewProps) {

    const classes = useStyles();

    return (
        <List className={classes.root}>
            {
                props.reports.map(report => (
                    <ListItem
                        button
                        key={"report_" + report.id}
                        selected={props.selected?.id === report.id}
                        onClick={() => props.onSelect(report)}
                        >
                        <ReportLabelView
                            report={report}
                            />
                    </ListItem>
                ))
            }
        </List>
    );
}