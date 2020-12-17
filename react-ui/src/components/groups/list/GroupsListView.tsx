import * as React from 'react'
import { makeStyles, Box, Container, IconButton } from '@material-ui/core';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import GroupExplorerView from '../GroupExplorerView';
import { GroupId } from '../../../models/Identificators';
import { Group } from '../../../models/Permissions';
import CreateGroupDialogContainer from './CreateGroupDialogContainer';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        maxWidth: 400,
        textAlign: 'left'
    }
}));

export interface IGroupsListViewParameters {
    data: {
        loading: 'idle' | 'pending' | 'succeeded';
        groups: Array<Group>;
    };
    selectedGroup: GroupId | null;
}

export interface IGroupsListViewActions {
    fetchGroups(): void;
    selectGroup(groupId: GroupId | null): void;
    openCreateGroupDialog(): void;
}

export interface IGroupsListViewProps extends IGroupsListViewActions, IGroupsListViewParameters {
}

export default function GroupsListView(props: IGroupsListViewProps) {

    const classes = useStyles();

    React.useEffect(() => {
        if (props.data.loading === 'idle') {
            props.fetchGroups();
        }
    });

    return (
        <Box className={classes.root}>
            <Container>
                <IconButton
                    color="primary" aria-label="Create Group"
                    onClick={props.openCreateGroupDialog}>
                    <GroupAddIcon />
                </IconButton>
            </Container>
            <CreateGroupDialogContainer />
            <GroupExplorerView
                groups={props.data.groups}
                currentGroup={props.selectedGroup}
                onCurrentGroupChange={props.selectGroup} />
        </Box>
    );
}