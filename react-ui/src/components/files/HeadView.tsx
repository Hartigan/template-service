import * as React from 'react'
import { makeStyles } from '@material-ui/core';
import TreeItem from '@material-ui/lab/TreeItem';
import { HeadLink } from '../../models/Folder';
import { FileExplorerState } from '../../states/FileExplorerState';

const useStyles = makeStyles(theme => ({
}));

export interface IHeadViewProperties {
    head: HeadLink
    fileExplorerState: FileExplorerState;
}

export default function HeadView(props: IHeadViewProperties) {
    const fileExplorerState = props.fileExplorerState;
    const [ isLoaded, setIsLoaded ] = React.useState<boolean>(false);

    const onClick = () => {
        fileExplorerState.setCurrentHead(props.head);
    };

    React.useEffect(() => {
        if (isLoaded) {
            return;
        }
        setIsLoaded(true);
    }); 

    const classes = useStyles();

    return (
        <TreeItem
            nodeId={props.head.id}
            label={props.head.name}
            onClick={onClick} />
    );
}