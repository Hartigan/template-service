import * as React from 'react'
import { makeStyles, Typography } from '@material-ui/core';
import AssessmentIcon from '@material-ui/icons/Assessment';
import DateView from '../../utils/DateView';
import { ReportModel } from '../../../models/domain';

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
    report: ReportModel;
}

export default function ReportLabelView(props: IReportLabelViewProperties) {

    const classes = useStyles();

    return (
        <div className={classes.labelRoot}>
            <AssessmentIcon className={classes.labelIcon} />
            <DateView date={new Date(props.report.finishedAt)} dateOnly={true} />
            <Typography variant="body2" className={classes.labelText}>
                {props.report.problemSet?.title}
            </Typography>
        </div>
    );
}