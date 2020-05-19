import * as React from 'react'
import { makeStyles, Typography } from '@material-ui/core';
import TreeItem from '@material-ui/lab/TreeItem';
import { HeadLink } from '../../models/Folder';
import { FileExplorerState } from '../../states/FileExplorerState';
import NoteIcon from '@material-ui/icons/Note';
import ListAltIcon from '@material-ui/icons/ListAlt';

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

export interface IHeadViewProperties {
    head: HeadLink
    fileExplorerState: FileExplorerState;
}

export default function HeadView(props: IHeadViewProperties) {
    const fileExplorerState = props.fileExplorerState;

    const onClick = () => {
        fileExplorerState.setCurrentHead(props.head);
    };

    const classes = useStyles();

    var icon = (<div/>);
    switch (props.head.type) {
        case "problem":
            icon = (
                <NoteIcon className={classes.labelIcon} />
            );
            break;
        case "problem_set":
            icon = (
                <ListAltIcon className={classes.labelIcon} />
            );
            break;
    }

    return (
        <TreeItem
            nodeId={props.head.id}
            label={
                <div className={classes.labelRoot}>
                    {icon}
                    <Typography variant="body2" className={classes.labelText}>
                        {props.head.name}
                    </Typography>
                </div>
            }
            onClick={onClick} />
    );
}