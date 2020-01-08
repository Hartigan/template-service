import * as React from 'react'
import { makeStyles, Typography } from '@material-ui/core';
import TreeItem from '@material-ui/lab/TreeItem';
import { FolderLink, Folder } from '../../models/Folder';
import { FoldersService } from '../../services/FoldersService';
import HeadView from './HeadView';
import { FileExplorerState } from '../../states/FileExplorerState';
import { FolderId, HeadId } from '../../models/Identificators';
import { TargetType } from '../../models/Commit';
import { VersionService } from '../../services/VersionService';
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

export interface IFolderViewProperties {
    folder: FolderLink;
    foldersService: FoldersService;
    fileExplorerState: FileExplorerState;
    versionService: VersionService;
    filter?: Array<TargetType>;
}

export default function FolderView(props: IFolderViewProperties) {

    const [ folder, setFolder ] = React.useState<Folder | null>(null);

    const onClick = () => {
        props.fileExplorerState.setCurrentFolder(props.folder);
    };
  
    const sync = async () => {
        const f = await props.foldersService
            .getFolder(props.folder.id);

        if (props.filter) {
            const filter = new Set(props.filter);
            f.heads = f.heads.filter(link => filter.has(link.type));
        }

        setFolder(f);
    };

    React.useEffect(() => {
        const folderUpdatedSub = props.fileExplorerState
            .folderUpdated()
            .subscribe(async (id: FolderId) => {
                if (props.folder.id === id) {
                    sync();
                } 
            });

        if (!folder) {
            sync();
        }

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
            label={
                <div className={classes.labelRoot}>
                    <FolderIcon className={classes.labelIcon} />
                    <Typography variant="body2" className={classes.labelText}>
                        {props.folder.name}
                    </Typography>
                </div>
            }
            onClick={onClick}>
            {children}
        </TreeItem>
    );
}