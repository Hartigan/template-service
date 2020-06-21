import React from "react";
import { Typography, Box } from "@material-ui/core";

export interface ITabPanelProps {
    children: Array<React.ReactNode> | React.ReactNode;
    index: number;
    value: number;
}

export function TabPanel(props: ITabPanelProps) {
    const { children, value, index } = props;

    return (
        <Typography
            component="div"
            hidden={value !== index}
            id={`nav-tabpanel-${index}`}
        >
            {value === index && <Box>{children}</Box>}
        </Typography>
    );
}
