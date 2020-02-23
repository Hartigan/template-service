import { makeStyles, ListItem, ListItemText, Container, ListItemSecondaryAction, IconButton, FormControlLabel, Checkbox, Box, Toolbar } from "@material-ui/core";
import React from "react";
import { Member, Access } from "../../models/Permissions";
import DeleteIcon from '@material-ui/icons/Delete';
import { UserId } from "../../models/Identificators";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
    },
    toolbar: {
        width: "100%",
    }
}));

export interface IMemberListItemViewProps {
    onRemove: (userId: UserId) => void;
    onUpdateAccess: (userId: UserId, access: Access) => void;
    member: Member;
}

export default function MemberListItemView(props: IMemberListItemViewProps) {

    const access = props.member.access;

    const classes = useStyles();

    const setGenerate = (value: boolean) => {
        props.onUpdateAccess(
            props.member.user_id,
            {
                ...props.member.access,
                generate: value
            }
        )
    };

    const setRead = (value: boolean) => {
        props.onUpdateAccess(
            props.member.user_id,
            {
                ...props.member.access,
                read: value
            }
        )
    };

    const setWrite = (value: boolean) => {
        props.onUpdateAccess(
            props.member.user_id,
            {
                ...props.member.access,
                write: value
            }
        )
    };

    const setAdmin = (value: boolean) => {
        props.onUpdateAccess(
            props.member.user_id,
            {
                ...props.member.access,
                admin: value
            }
        )
    };

    return (
        <ListItem key={props.member.user_id} className={classes.root}>
            <ListItemText primary={props.member.name}/>
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
                    <IconButton aria-label="delete" onClick={() => props.onRemove(props.member.user_id)}>
                        <DeleteIcon />
                    </IconButton>
                </Toolbar>
            </ListItemSecondaryAction>
        </ListItem>
    );

};