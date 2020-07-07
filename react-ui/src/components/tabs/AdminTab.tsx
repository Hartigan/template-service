import { makeStyles } from "@material-ui/core";
import React from "react";
import AdminView from "../admin/AdminView";
import { AdminService } from "../../services/AdminService";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
}));

export interface IAdminTabProps {
    adminService: AdminService;
}

export default function AdminTab(props: IAdminTabProps) {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AdminView adminService={props.adminService} />
        </div>
    );
};