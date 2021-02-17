import * as React from 'react'
import { makeStyles, Box } from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FolderView, { IFolderNode } from './FolderView';
import { FolderLinkModel, HeadLinkModel } from '../../../models/domain';
import { TargetModel } from '../../../protobuf/domain_pb';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        width: "100%",
    }
}));

export interface IFilesTreeActions {
    setExpanded: (expanded: Array<string>) => void;
    fetchRoot: () => void;
    selectFolder: (folder: FolderLinkModel) => void;
    selectHead: (head: HeadLinkModel) => void;
}

export interface IFileTreeParameters {
    data: {
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'succeeded';
        root: IFolderNode;
    };

    expanded: Array<string>;
    selectedFolder: FolderLinkModel | null;
    selectedHead: HeadLinkModel | null;
    filter?: Array<TargetModel.ModelType>;
}

export interface IFilesTreeViewProps extends IFilesTreeActions, IFileTreeParameters {
}

export default function FileTreeView(props: IFilesTreeViewProps) {
    React.useEffect(() => {
        if (props.data.loading === 'idle') {
            props.fetchRoot();
        }
    }); 

    const handleChange = (event: {}, nodes: Array<string>) => {
        props.setExpanded(nodes);
    };

    const rootFolder = props.data.loading === 'succeeded' ? (
        <FolderView
            node={props.data.root}
            filter={props.filter}
            selectedFolder={props.selectedFolder}
            selectedHead={props.selectedHead}
            onSelectFolder={props.selectFolder}
            onSelectHead={props.selectHead} />
    ) : <div/>;

    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                onNodeToggle={handleChange}
                expanded={props.expanded}>
                {rootFolder}
            </TreeView>
        </Box>
    );
}