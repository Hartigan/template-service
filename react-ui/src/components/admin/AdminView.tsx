import * as React from 'react'
import { makeStyles, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { AdminUser } from '../../models/AdminUser';
import { AdminService } from '../../services/AdminService';
import TagsEditorView from '../utils/TagsEditorView';
import { UserId } from '../../models/Identificators';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    table: {
        margin: "auto",
        width: "60%",
        overflowX: "hidden"
    },
    tableHeaderCell: {
        fontWeight: "bold"
    },
}));

interface IState {
    users: Array<AdminUser> | null;
}

export interface IAdminViewProps {
    adminService: AdminService;
}

export default function AdminView(props: IAdminViewProps) {

    const [ state, setState ] = React.useState<IState>({
        users: null,
    });
  
    React.useEffect(() => {
        if (state.users !== null) {
            return;
        }
        let canUpdate = true;
        props.adminService
            .get()
            .then(users => {
                if (canUpdate) {
                    setState({
                        users: users,
                    });
                }
            });

        return () => {
            canUpdate = false;
        }
    }); 

    const classes = useStyles();

    const onAddRole = async (userId: UserId, current: Array<string>, role: string) => {
        if (current.includes(role)) {
            return;
        }

        if (state.users === null) {
            return;
        }

        const users = [...state.users];
        const user = users.find(x => x.id === userId);

        if (!user) {
            return;
        }

        const newRoles = [...current, role];

        await props.adminService.update(userId, newRoles);
        
        user.roles = newRoles;

        setState({
            ...state,
            users: users
        });
    };


    const onRemoveRole = async (userId: UserId, current: Array<string>, role: string) => {
        if (!current.includes(role)) {
            return;
        }

        if (state.users === null) {
            return;
        }

        const users = [...state.users];
        const user = users.find(x => x.id === userId);

        if (!user) {
            return;
        }

        const newRoles = current.filter(x => x !== role);

        await props.adminService.update(userId, newRoles);
        
        user.roles = newRoles;

        setState({
            ...state,
            users: users
        });
    };

    const users = state.users ?? [];

    return (
        <div className={classes.root}>
            <TableContainer component={Paper} className={classes.table}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHeaderCell} align="right">Username</TableCell>
                            <TableCell className={classes.tableHeaderCell} align="right">First name</TableCell>
                            <TableCell className={classes.tableHeaderCell} align="right">Last name</TableCell>
                            <TableCell className={classes.tableHeaderCell} align="right">Email</TableCell>
                            <TableCell className={classes.tableHeaderCell} align="right">Roles</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                        users.map(user => {
                            return (
                                <TableRow key={"user_" + user.id}>
                                    <TableCell align="right">{user.username}</TableCell>
                                    <TableCell align="right">{user.first_name}</TableCell>
                                    <TableCell align="right">{user.last_name}</TableCell>
                                    <TableCell align="right">{user.email}</TableCell>
                                    <TableCell align="right">
                                        <TagsEditorView
                                            tags={user.roles}
                                            placeholderText="new role"
                                            onAdd={role => onAddRole(user.id, user.roles, role)}
                                            onRemove={role => onRemoveRole(user.id, user.roles, role)}
                                            />
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}