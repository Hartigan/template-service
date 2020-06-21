import * as React from 'react'
import { makeStyles } from '@material-ui/core';
import TreeItem from '@material-ui/lab/TreeItem';
import { HeadLink } from '../../models/Folder';
import { FileExplorerState } from '../../states/FileExplorerState';
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
    head: HeadLink
    fileExplorerState: FileExplorerState;
}

export default function HeadTreeItemView(props: IHeadTreeItemViewProperties) {
    const fileExplorerState = props.fileExplorerState;

    const onClick = () => {
        fileExplorerState.setCurrentHead(props.head);
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