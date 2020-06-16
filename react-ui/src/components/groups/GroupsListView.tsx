import * as React from 'react'
import { makeStyles, Box, Container, IconButton } from '@material-ui/core';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import CreateGroupDialog from './CreateGroupDialog';
import GroupExplorerView from './GroupExplorerView';
import { GroupId } from '../../models/Identificators';
import { Group } from '../../models/Permissions';
import { isNull } from 'util';
import { GroupService } from '../../services/GroupService';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        maxWidth: 400,
        textAlign: 'left'
    }
}));

interface IState {
    openCreateGroupDialog : boolean;
    groups: Array<Group> | null;
}

export interface IGroupsListViewProps {
    groupService: GroupService;
    currentGroup: GroupId | null;
    onCurrentGroupChange: (groupId: GroupId) => void;
}

export default function GroupsListView(props: IGroupsListViewProps) {

    const [ state, setState ] = React.useState<IState>({
        openCreateGroupDialog: false,
        groups: null
    });

    const classes = useStyles();

    const setOpenCreateGroupDialog = (open: boolean) => {
        setState({
            ...state,
            openCreateGroupDialog: open
        })
    };

    const fetchGroups = async () => {
        let groups = await props.groupService.getGroups({
            admin: true,
            read: false,
            write: false,
            generate: false
        });
        setState({
            ...state,
            openCreateGroupDialog: false,
            groups: groups
        });
    };

    React.useEffect(() => {
        if (isNull(state.groups)) {
            fetchGroups();
        }
    });

    const onCloseCreateGroupDialog = async () => {
        await fetchGroups();
    };

    return (
        <Box className={classes.root}>
            <Container>
                <IconButton
                    color="primary" aria-label="Create Group"
                    onClick={() => setOpenCreateGroupDialog(true)}>
                    <GroupAddIcon />
                </IconButton>
            </Container>
            <CreateGroupDialog
                groupService={props.groupService}
                open={state.openCreateGroupDialog}
                onClose={onCloseCreateGroupDialog} />
            <GroupExplorerView
                groups={isNull(state.groups) ? [] : state.groups}
                currentGroup={props.currentGroup}
                onCurrentGroupChange={props.onCurrentGroupChange} />
        </Box>
    );
}