import * as React from 'react'
import { makeStyles, List, ListItem } from '@material-ui/core';
import HeadLabelView from './HeadLabelView';
import { HeadLinkModel, HeadModel } from '../../../models/domain';
import { TargetModel } from '../../../protobuf/domain_pb';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    }
}));

export interface IHeadsListViewProps {
    heads: Array<HeadModel>;
    onSelect: (link: HeadLinkModel) => void;
    selected: HeadLinkModel | null;
};

export default function HeadsListView(props: IHeadsListViewProps) {

    const classes = useStyles();

    return (
        <List className={classes.root}>
            {
                props.heads
                    .map(head => {
                        return {
                            id: head.id,
                            name: head.name,
                            type: head.commit?.target?.type ?? TargetModel.ModelType.UNKNOWN
                        };
                    })
                    .map(head => (
                        <ListItem
                            button
                            key={"head_" + head.id}
                            selected={props.selected?.id === head.id}
                            onClick={() => props.onSelect(head)}
                            >
                            <HeadLabelView
                                head={head}
                                />
                        </ListItem>
                    ))
            }
        </List>
    );
}