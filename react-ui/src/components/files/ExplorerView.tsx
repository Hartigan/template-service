import * as React from 'react'
import { makeStyles, Box } from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { FoldersService } from '../../services/FoldersService';
import FolderView from './FolderView';
import { FileExplorerState } from '../../states/FileExplorerState';
import { Folder, FolderLink } from '../../models/Folder';
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

export default function ExplorerView(props: IExplorerViewProps) {

    const [ isLoaded, setIsLoaded ] = React.useState<boolean>(false);
    const [ expanded, setExpanded] = React.useState<Array<string>>([]);
    const [ root, setRoot ] = React.useState<FolderLink | null>(null);

    React.useEffect(() => {
        if (isLoaded) {
            return;
        }
        setIsLoaded(true);

        props.foldersService
            .getRoot()
            .then(root => {
                setRoot({
                    id: root.id,
                    name: root.name,
                });
            });
    }); 

    const handleChange = (event: {}, nodes: Array<string>) => {
        setExpanded(nodes);
    };

    const rootFolder = root ? (
        <FolderView
            versionService={props.versionService}
            folder={root}
            foldersService={props.foldersService}
            filter={props.filter}
            fileExplorerState={props.state} />
    ) : null;

    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                onNodeToggle={handleChange}
                expanded={expanded}>
                {rootFolder}
            </TreeView>
        </Box>
    );
}