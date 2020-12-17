import * as React from 'react'
import { makeStyles, Typography } from '@material-ui/core';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { Report } from '../../../models/Report';
import DateView from '../../utils/DateView';

const useStyles = makeStyles(theme => ({
    labelIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
        margin: "0px 0px 0px 3px"
    },
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 0),
    },
}));

export interface IReportLabelViewProperties {
    report: Report;
}

export default function ReportLabelView(props: IReportLabelViewProperties) {

    const classes = useStyles();

    return (
        <div className={classes.labelRoot}>
            <AssessmentIcon className={classes.labelIcon} />
            <DateView date={props.report.finished_at} dateOnly={true} />
            <Typography variant="body2" className={classes.labelText}>
                {props.report.problem_set.title}
            </Typography>
        </div>
    );
}