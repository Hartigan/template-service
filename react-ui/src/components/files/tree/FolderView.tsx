import * as React from 'react'
import { makeStyles, Typography } from '@material-ui/core';
import TreeItem from '@material-ui/lab/TreeItem';
import { FolderLink, HeadLink } from '../../../models/Folder';
import HeadTreeItemView from './HeadTreeItemView';
import { TargetType } from '../../../models/Commit';
import FolderIcon from '@material-ui/icons/Folder';

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


export interface IFolderNode {
    folder: FolderLink;
    children: {
        folders: Array<IFolderNode>;
        heads: Array<HeadLink>;
    };
    filter?: Array<TargetType>;
};

export interface IFolderViewProperties {
    node: IFolderNode;
    selectedFolder: FolderLink | null;
    selectedHead: HeadLink | null;
    onSelectHead: (head: HeadLink) => void;
    onSelectFolder: (folder: FolderLink) => void;
    filter?: Array<TargetType>;
}

export default function FolderView(props: IFolderViewProperties) {

    const onClick = () => {
        props.onSelectFolder(props.node.folder);
    };
  
    const classes = useStyles();

    var children : Array<React.ReactNode> = [];

    let nodes : Array<React.ReactNode> = [];
    props.node.children.folders.forEach(node => {
        nodes.push((
            <FolderView
                key={node.folder.id}
                node={node}
                selectedFolder={props.selectedFolder}
                selectedHead={props.selectedHead}
                onSelectFolder={props.onSelectFolder}
                onSelectHead={props.onSelectHead}
                />
        ))
    });
    props.node.children.heads.filter(h => {
        if (props.filter) {
            return props.filter.includes(h.type);
        } else {
            return true;
        }
    }).forEach(link => {
        nodes.push((
            <HeadTreeItemView
                key={link.id}
                head={link}
                selected={props.selectedHead}
                onSelect={props.onSelectHead}
                />
        ))
    });
    children = nodes;

    return (
        <TreeItem
            nodeId={props.node.folder.id}
            label={
                <div className={classes.labelRoot}>
                    <FolderIcon className={classes.labelIcon} />
                    <Typography variant="body2" className={classes.labelText}>
                        {props.node.folder.name}
                    </Typography>
                </div>
            }
            onClick={onClick}>
            {children}
        </TreeItem>
    );
}