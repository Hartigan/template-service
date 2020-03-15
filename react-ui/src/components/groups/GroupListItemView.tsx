import { makeStyles, ListItem, ListItemText, ListItemSecondaryAction, IconButton, FormControlLabel, Checkbox, Toolbar } from "@material-ui/core";
import React from "react";
import { Access, GroupAccess } from "../../models/Permissions";
import DeleteIcon from '@material-ui/icons/Delete';
import { GroupId } from "../../models/Identificators";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
    },
    toolbar: {
        width: "100%",
    }
}));

export interface IGroupListItemViewProps {
    onRemove: (groupId: GroupId) => void;
    onUpdateAccess: (GroupId: GroupId, access: Access) => void;
    groupAccess: GroupAccess;
}

export default function GroupListItemView(props: IGroupListItemViewProps) {

    const access = props.groupAccess.access;

    const classes = useStyles();

    const setGenerate = (value: boolean) => {
        props.onUpdateAccess(
            props.groupAccess.group_id,
            {
                ...props.groupAccess.access,
                generate: value
            }
        )
    };

    const setRead = (value: boolean) => {
        props.onUpdateAccess(
            props.groupAccess.group_id,
            {
                ...props.groupAccess.access,
                read: value
            }
        )
    };

    const setWrite = (value: boolean) => {
        props.onUpdateAccess(
            props.groupAccess.group_id,
            {
                ...props.groupAccess.access,
                write: value
            }
        )
    };

    const setAdmin = (value: boolean) => {
        props.onUpdateAccess(
            props.groupAccess.group_id,
            {
                ...props.groupAccess.access,
                admin: value
            }
        )
    };

    return (
        <ListItem key={props.groupAccess.group_id} className={classes.root}>
            <ListItemText primary={props.groupAccess.name}/>
            <ListItemSecondaryAction>
                <Toolbar className={classes.toolbar}>
                    <FormControlLabel
                        control={<Checkbox color="primary" checked={access.generate} onChange={(event, value) => setGenerate(value)} />}
                        label="Generate"
                        labelPlacement="start"
                        />
                    <FormControlLabel
                        control={<Checkbox color="primary" checked={access.read} onChange={(event, value) => setRead(value)}/>}
                        label="Read"
                        labelPlacement="start"
                        />
                    <FormControlLabel
                        control={<Checkbox color="primary" checked={access.write} onChange={(event, value) => setWrite(value)}/>}
                        label="Write"
                        labelPlacement="start"
                        />
                    <FormControlLabel
                        control={<Checkbox color="primary" checked={access.admin} onChange={(event, value) => setAdmin(value)}/>}
                        label="Admin"
                        labelPlacement="start"
                        />
                    <IconButton aria-label="delete" onClick={() => props.onRemove(props.groupAccess.group_id)}>
                        <DeleteIcon />
                    </IconButton>
                </Toolbar>
            </ListItemSecondaryAction>
        </ListItem>
    );

};