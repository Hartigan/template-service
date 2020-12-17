import * as React from 'react'
import TreeItem from '@material-ui/lab/TreeItem';
import { HeadLink } from '../../../models/Folder';
import HeadLabelView from '../heads/HeadLabelView';

export interface IHeadTreeItemViewProperties {
    head: HeadLink;
    selected: HeadLink | null;
    onSelect: (head: HeadLink) => void;
}

export default function HeadTreeItemView(props: IHeadTreeItemViewProperties) {

    const onClick = () => {
        props.onSelect(props.head);
    };

    return (
        <TreeItem
            nodeId={props.head.id}
            label={
                <HeadLabelView head={props.head} />
            }
            onClick={onClick} />
    );
}