import * as React from 'react'
import { makeStyles, Box } from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FolderView from './FolderView';
import { FolderLink, HeadLink } from '../../models/Folder';
import { TargetType } from '../../models/Commit';
import { foldersService } from '../../Services';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        width: "100%",
    }
}));

export interface IExplorerViewProps {
    selectedFolder: FolderLink | null;
    selectedHead: HeadLink | null;
    updatedFolder: FolderLink | null;
    onFolderUpdated: () => void;
    onSelectFolder: (folder: FolderLink) => void;
    onSelectHead: (head: HeadLink) => void
    filter?: Array<TargetType>;
}

interface IState {
    root: FolderLink | null;
    expanded: Array<string>;
}

export default function ExplorerView(props: IExplorerViewProps) {

    const [ state, setState ] = React.useState<IState>({
        root: null,
        expanded: []
    })

    React.useEffect(() => {
        if (state.root) {
            return;
        }

        foldersService
            .getRoot()
            .then(root => {
                setState({
                    ...state,
                    root: {
                        id: root.id,
                        name: root.name,
                    }
                });
            });
    }); 

    const handleChange = (event: {}, nodes: Array<string>) => {
        setState({
            ...state,
            expanded: nodes
        });
    };

    const rootFolder = state.root ? (
        <FolderView
            folder={state.root}
            filter={props.filter}
            selectedFolder={props.selectedFolder}
            selectedHead={props.selectedHead}
            updatedFolder={props.updatedFolder}
            onFolderUpdated={props.onFolderUpdated}
            onSelectFolder={props.onSelectFolder}
            onSelectHead={props.onSelectHead} />
    ) : <div/>;

    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                onNodeToggle={handleChange}
                expanded={state.expanded}>
                {rootFolder}
            </TreeView>
        </Box>
    );
}