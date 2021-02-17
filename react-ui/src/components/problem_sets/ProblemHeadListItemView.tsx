import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import React, { useEffect } from "react";
import { HeadId } from "../../models/Identificators";
import RemoveIcon from '@material-ui/icons/Remove';
import Services from "../../Services";
import { HeadModel } from "../../models/domain";
import { GetHeadRequest } from "../../protobuf/version_pb";

interface IState {
    head: HeadModel | null;
}

export interface IProblemHeadListItemViewProps {
    headId: HeadId;
    index: number;
    selected: boolean;
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
        const request = new GetHeadRequest();
        request.setHeadId(props.headId);
        Services.versionService
            .getHead(request)
            .then(reply => {
                const error = reply.getError();
                if (error) {
                    Services.logger.error(error.getDescription());
                }
                const head = reply.getHead()?.toObject();
                if (!head) {
                    return;
                }

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