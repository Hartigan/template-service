import * as React from 'react'
import { makeStyles, List, ListItem } from '@material-ui/core';
import { Head } from '../../models/Head';
import { fromHead } from '../../models/Folder';
import { FileExplorerState } from '../../states/FileExplorerState';
import HeadLabelView from './HeadLabelView';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    }
}));

export interface IHeadsListViewProps {
    heads: Array<Head>;
    state: FileExplorerState;
};

export default function HeadsListView(props: IHeadsListViewProps) {

    const classes = useStyles();

    console.log(props.state.currentHead());

    return (
        <List className={classes.root}>
            {
                props.heads.map(head => (
                    <ListItem
                        button
                        key={"head_" + head.id}
                        onClick={() => props.state.setCurrentHead(fromHead(head))}
                        >
                        <HeadLabelView
                            head={fromHead(head)}
                            />
                    </ListItem>
                ))
            }
        </List>
    );
}