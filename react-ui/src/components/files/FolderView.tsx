import * as React from 'react'
import { makeStyles } from '@material-ui/core';
import TreeItem from '@material-ui/lab/TreeItem';
import { FolderLink, Folder } from '../../models/Folder';
import { FoldersService } from '../../services/FoldersService';
import HeadView from './HeadView';
import { FileExplorerState } from '../../states/FileExplorerState';
import { FolderId } from '../../models/Identificators';

const useStyles = makeStyles(theme => ({
}));

export interface IFolderViewProperties {
    folder: FolderLink;
    foldersService: FoldersService;
    fileExplorerState: FileExplorerState;
}

export default function FolderView(props: IFolderViewProperties) {

    const folderLink = props.folder;
    const foldersService = props.foldersService;
    const fileExplorerState = props.fileExplorerState;
    const [ isLoaded, setIsLoaded ] = React.useState<boolean>(false);
    const [ children, setChildren ] = React.useState<Array<React.ReactNode>>([]);
    
    props.fileExplorerState
        .folderUpdated()
        .subscribe(async (id: FolderId) => {
            if (folderLink.id === id) {
                sync();
            } 
        });

    const onClick = () => {
        fileExplorerState.setCurrentFolder(folderLink.id);
    };
  
    const sync = () => {
        foldersService
            .getFolder(folderLink.id)
            .then(folder => {
                let nodes : Array<React.ReactNode> = [];
                folder.folders.forEach(link => {
                    nodes.push((
                        <FolderView
                            folder={link}
                            foldersService={foldersService}
                            fileExplorerState={fileExplorerState} />
                    ))
                });
                folder.heads.forEach(link => {
                    nodes.push((
                        <HeadView
                            head={link}
                            fileExplorerState={fileExplorerState} />
                    ))
                });
                setChildren(nodes);
            });
    };

    React.useEffect(() => {
        if (isLoaded) {
            return;
        }
        setIsLoaded(true);
        sync();
    });

    const classes = useStyles();

    return (
        <TreeItem
            nodeId={folderLink.id}
            label={folderLink.name}
            children={children}
            onClick={onClick} />
    );
}