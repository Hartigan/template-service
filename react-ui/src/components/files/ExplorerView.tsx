import * as React from 'react'
import { makeStyles, Box } from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { FoldersService } from '../../services/FoldersService';
import FolderView from './FolderView';
import { FileExplorerState } from '../../states/FileExplorerState';
import { FolderLink } from '../../models/Folder';
import { TargetType } from '../../models/Commit';
import { VersionService } from '../../services/VersionService';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        width: "100%",
    }
}));

export interface IExplorerViewProps {
    foldersService: FoldersService;
    versionService: VersionService;
    state: FileExplorerState;
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

        props.foldersService
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
            versionService={props.versionService}
            folder={state.root}
            foldersService={props.foldersService}
            filter={props.filter}
            fileExplorerState={props.state} />
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