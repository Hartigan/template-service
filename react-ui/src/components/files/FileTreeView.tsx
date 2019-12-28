import * as React from 'react'
import { makeStyles, Box, Container, Button } from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { FoldersService } from '../../services/FoldersService';
import FolderView from './FolderView';
import { FileExplorerState } from '../../states/FileExplorerState';
import CreateFolderDialog from './CreateFolderDialog';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        maxWidth: 400,
        textAlign: 'left'
    }
}));

export interface IFileTreeViewProps {
    foldersService: FoldersService;
    state: FileExplorerState;
}

export default function FileTreeView(props: IFileTreeViewProps) {

    const foldersService = props.foldersService;
    const fileExplorerState = props.state;

    const [ isLoaded, setIsLoaded ] = React.useState<boolean>(false);
    const [ children, setChildren ] = React.useState<Array<React.ReactNode>>([]);
    const [ expanded, setExpanded] = React.useState<Array<string>>([]);
    const [ openCreateFolderDialog, setOpenCreateFolderDialog ] = React.useState(false);

    React.useEffect(() => {
        if (isLoaded) {
            return;
        }
        setIsLoaded(true);

        foldersService
            .getRoot()
            .then(root => {
                let folderLink = {
                    id: root.id,
                    name: root.name,
                }
                setChildren([
                    (
                        <FolderView
                            folder={folderLink}
                            foldersService={foldersService}
                            fileExplorerState={fileExplorerState} />
                    )
                ])
            });
    }); 

    const handleChange = (event: {}, nodes: Array<string>) => {
        setExpanded(nodes);
    };

    const showCreateFolderDialog = () => {
        setOpenCreateFolderDialog(true);
    };

    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Container>
                <Button onClick={showCreateFolderDialog}>New folder</Button>
            </Container>
            <CreateFolderDialog
                fileExplorerState={fileExplorerState}
                foldersService={foldersService}
                open={openCreateFolderDialog}
                onClose={() => setOpenCreateFolderDialog(false)} />
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                onNodeToggle={handleChange}
                expanded={expanded}
                children={children}/>
        </Box>
    );
}