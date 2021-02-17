import * as React from 'react'
import { makeStyles, List, ListItemText, ListItem } from '@material-ui/core';
import { GroupId } from '../../models/Identificators';
import { GroupModel } from '../../models/domain';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        width: "100%",
    }
}));


export interface IGroupExplorerViewProps {
    onCurrentGroupChange: (groupId: GroupId) => void;
    currentGroup: GroupId | null;
    groups: Array<GroupModel>;
}

export default function GroupExplorerView(props: IGroupExplorerViewProps) {

    const classes = useStyles();

    return (
        <List className={classes.root}>
            {
                props.groups.map(group => (
                    <ListItem button
                        key={"group_" + group.id}
                        selected={group.id === props.currentGroup}
                        onClick={event => props.onCurrentGroupChange(group.id)}>
                        <ListItemText primary={group.name}/>
                    </ListItem>
                ))
            }
        </List>
    );
}