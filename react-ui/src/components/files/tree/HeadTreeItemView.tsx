import * as React from 'react'
import TreeItem from '@material-ui/lab/TreeItem';
import HeadLabelView from '../heads/HeadLabelView';
import { HeadLinkModel } from '../../../models/domain';

export interface IHeadTreeItemViewProperties {
    head: HeadLinkModel;
    selected: HeadLinkModel | null;
    onSelect: (head: HeadLinkModel) => void;
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