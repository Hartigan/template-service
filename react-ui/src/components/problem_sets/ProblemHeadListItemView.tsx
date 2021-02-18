import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import React from "react";
import RemoveIcon from '@material-ui/icons/Remove';
import { HeadModel } from "../../models/domain";

export interface IProblemHeadListItemViewProps {
    head: HeadModel;
    index: number;
    selected: boolean;
    onClick(index: number): void;
    onRemove?(index: number): void;
}

export default function ProblemHeadListItemView(props: IProblemHeadListItemViewProps) {

    const getAction = () => {
        if (props.onRemove) {
            const onRemove = () => {
                if (props.onRemove) {
                    props.onRemove(props.index);
                }
            };

            return (
                <IconButton
                    size="small"
                    color="primary"
                    onClick={onRemove}
                    >
                    <RemoveIcon/>
                </IconButton>
            );
        }
        else {
            return (<div/>);
        }
    };

    return (
        <ListItem
            selected={props.selected}
            onClick={(e) => {props.onClick(props.index); e.stopPropagation(); }}
            >
            <ListItemText primary={props.head.name} />
            <ListItemSecondaryAction>
                {getAction()}
            </ListItemSecondaryAction>
        </ListItem>
    );
};