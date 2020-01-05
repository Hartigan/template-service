import * as React from 'react'
import { makeStyles } from '@material-ui/core';
import TreeItem from '@material-ui/lab/TreeItem';
import { FolderLink, Folder } from '../../models/Folder';
import { FoldersService } from '../../services/FoldersService';
import HeadView from './HeadView';
import { FileExplorerState } from '../../states/FileExplorerState';
import { FolderId, HeadId } from '../../models/Identificators';
import { TargetType } from '../../models/Commit';
import { VersionService } from '../../services/VersionService';

const useStyles = makeStyles(theme => ({
}));

export interface IFolderViewProperties {
    folder: FolderLink;
    foldersService: FoldersService;
    fileExplorerState: FileExplorerState;
    versionService: VersionService;
    filter?: Array<TargetType>;
}

export default function FolderView(props: IFolderViewProperties) {

    const [ isLoaded, setIsLoaded ] = React.useState<boolean>(false);
    const [ folder, setFolder ] = React.useState<Folder | null>(null);

    const onClick = () => {
        props.fileExplorerState.setCurrentFolder(props.folder.id);
    };
  
    const sync = async () => {
        const f = await props.foldersService
            .getFolder(props.folder.id);

        if (props.filter) {
            const filter = props.filter;
            const heads = await Promise.all(f.heads.map(async link => props.versionService.getHead(link.id)));
            const allowed = new Set<HeadId>(heads.filter(head => filter.includes(head.commit.target.type)).map(head => head.id));
            f.heads = f.heads.filter(link => allowed.has(link.id));
        }

        setFolder(f);
    };

    React.useEffect(() => {
        let folderUpdatedSub = props.fileExplorerState
            .folderUpdated()
            .subscribe(async (id: FolderId) => {
                if (props.folder.id === id) {
                    sync();
                } 
            });

        if (isLoaded) {
            return;
        }
        setIsLoaded(true);
        sync();

        return () => {
            folderUpdatedSub.unsubscribe();
        };
    });

    const classes = useStyles();

    var children : Array<React.ReactNode> = [];

    if (folder) {
        let nodes : Array<React.ReactNode> = [];
        folder.folders.forEach(link => {
            nodes.push((
                <FolderView
                    key={link.id}
                    filter={props.filter}
                    versionService={props.versionService}
                    folder={link}
                    foldersService={props.foldersService}
                    fileExplorerState={props.fileExplorerState} />
            ))
        });
        folder.heads.forEach(link => {
            nodes.push((
                <HeadView
                    key={link.id}
                    head={link}
                    fileExplorerState={props.fileExplorerState} />
            ))
        });
        children = nodes;
    }

    return (
        <TreeItem
            nodeId={props.folder.id}
            label={props.folder.name}
            onClick={onClick}>
            {children}
        </TreeItem>
    );
}