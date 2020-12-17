import * as React from 'react'
import { makeStyles, List, ListItem } from '@material-ui/core';
import HeadLabelView from './HeadLabelView';
import { HeadLink, fromHead } from '../../../models/Folder';
import { Head } from '../../../models/Head';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    }
}));

export interface IHeadsListViewProps {
    heads: Array<Head>;
    onSelect: (link: HeadLink) => void;
    selected: HeadLink | null;
};

export default function HeadsListView(props: IHeadsListViewProps) {

    const classes = useStyles();

    return (
        <List className={classes.root}>
            {
                props.heads.map(head => (
                    <ListItem
                        button
                        key={"head_" + head.id}
                        selected={props.selected?.id === head.id}
                        onClick={() => props.onSelect(fromHead(head))}
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