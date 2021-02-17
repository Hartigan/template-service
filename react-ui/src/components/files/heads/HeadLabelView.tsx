import * as React from 'react'
import { makeStyles, Typography } from '@material-ui/core';
import NoteIcon from '@material-ui/icons/Note';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { HeadLinkModel } from '../../../models/domain';
import { TargetModel } from '../../../protobuf/domain_pb';

const useStyles = makeStyles(theme => ({
    labelIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
    },
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 0),
    },
}));

export interface IHeadLabelViewProperties {
    head: HeadLinkModel;
}

export default function HeadLabelView(props: IHeadLabelViewProperties) {

    const classes = useStyles();

    var icon = (<div/>);
    switch (props.head.type) {
        case TargetModel.ModelType.PROBLEM:
            icon = (
                <NoteIcon className={classes.labelIcon} />
            );
            break;
        case TargetModel.ModelType.PROBLEMSET:
            icon = (
                <ListAltIcon className={classes.labelIcon} />
            );
            break;
    }

    return (
        <div className={classes.labelRoot}>
            {icon}
            <Typography variant="body2" className={classes.labelText}>
                {props.head.name}
            </Typography>
        </div>
    );
}