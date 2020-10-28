import * as React from 'react'
import { makeStyles, Typography } from '@material-ui/core';
import TreeItem from '@material-ui/lab/TreeItem';
import { FolderLink, Folder, HeadLink } from '../../models/Folder';
import HeadTreeItemView from './HeadTreeItemView';
import { FolderId } from '../../models/Identificators';
import { TargetType } from '../../models/Commit';
import FolderIcon from '@material-ui/icons/Folder';
import { foldersService } from '../../Services';

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
    selectedFolder: FolderLink | null;
    selectedHead: HeadLink | null;
    updatedFolder: FolderLink | null;
    onFolderUpdated: () => void;
    onSelectHead: (head: HeadLink) => void;
    onSelectFolder: (folder: FolderLink) => void;
    filter?: Array<TargetType>;
}

export default function FolderView(props: IFolderViewProperties) {

    const [ folder, setFolder ] = React.useState<Folder | null>(null);

    if (props.updatedFolder && props.updatedFolder.id === folder?.id) {
        setFolder(null);
        props.onFolderUpdated();
    }

    const onClick = () => {
        if (folder) {
            props.onSelectFolder(folder);
        }
    };
  
    const fetchData = async (folder: FolderId) => {
        const f = await foldersService.getFolder(props.folder.id);

        if (props.filter) {
            const filter = new Set(props.filter);
            f.heads = f.heads.filter(link => filter.has(link.type));
        }

        return f;
    };

    React.useEffect(() => {
        let canUpdate = true;

        if (!folder) {
            fetchData(props.folder.id).then(f => {
                if (canUpdate) {
                    setFolder(f);
                }
            })
        }

        return () => {
            canUpdate = false;
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
                    folder={link}
                    selectedFolder={props.selectedFolder}
                    updatedFolder={props.updatedFolder}
                    selectedHead={props.selectedHead}
                    onFolderUpdated={props.onFolderUpdated}
                    onSelectFolder={props.onSelectFolder}
                    onSelectHead={props.onSelectHead}
                    />
            ))
        });
        folder.heads.forEach(link => {
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