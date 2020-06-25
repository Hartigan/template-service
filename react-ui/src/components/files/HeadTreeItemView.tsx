import * as React from 'react'
import { makeStyles } from '@material-ui/core';
import TreeItem from '@material-ui/lab/TreeItem';
import { HeadLink } from '../../models/Folder';
import HeadLabelView from './HeadLabelView';

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

export interface IHeadTreeItemViewProperties {
    head: HeadLink;
    selected: HeadLink | null;
    onSelect: (head: HeadLink) => void;
}

export default function HeadTreeItemView(props: IHeadTreeItemViewProperties) {

    const onClick = () => {
        props.onSelect(props.head);
    };

    const classes = useStyles();

    return (
        <TreeItem
            nodeId={props.head.id}
            label={
                <HeadLabelView head={props.head} />
            }
            onClick={onClick} />
    );
}