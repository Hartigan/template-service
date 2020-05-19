import { makeStyles, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import React, { useEffect } from "react";
import { HeadId } from "../../models/Identificators";
import { Head } from "../../models/Head";
import { VersionService } from "../../services/VersionService";
import RemoveIcon from '@material-ui/icons/Remove';

const useStyles = makeStyles(theme => ({
}));

interface IState {
    head: Head | null;
}

export interface IProblemHeadListItemViewProps {
    headId: HeadId;
    index: number;
    selected: boolean;
    versionService: VersionService;
    onClick(index: number): void;
    onRemove?(index: number): void;
}

export default function ProblemHeadListItemView(props: IProblemHeadListItemViewProps) {

    const [ state, setState ] = React.useState<IState>({
        head: null
    })

    useEffect(() => {
        let canUpdate = true;
    
        if (state.head && state.head.id === props.headId) {
            return;
        }

        props.versionService
            .getHead(props.headId)
            .then(head => {
                if (!canUpdate || props.headId !== head.id) {
                    return;
                }

                setState({
                    ...state,
                    head: head
                })
            });

        return () => {
            canUpdate = false;
        };
    });

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

    const classes = useStyles();

    if (state.head) {
        return (
            <ListItem
                selected={props.selected}
                onClick={(e) => {props.onClick(props.index); e.stopPropagation(); }}
                >
                <ListItemText primary={state.head.name} />
                <ListItemSecondaryAction>
                    {getAction()}
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
    else {
        return (
            <ListItem>
            </ListItem>
        );
    }
    

};