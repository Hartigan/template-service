import { makeStyles, List, ListItem, ListItemText } from "@material-ui/core";
import React from "react";
import { HeadId } from "../../models/Identificators";
import { HeadLink } from "../../models/Folder";

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 275,
    },
}));

export interface IProblemsListViewProps {
    links: Array<HeadLink>;
    onSelect(index: number): void;
}

export default function ProblemsListView(props: IProblemsListViewProps) {

    const classes = useStyles();

    const [ selectedIndex, setSelectedIndex ] = React.useState<number | null>(null);

    const onClick = (index: number) => {
        setSelectedIndex(index);
        props.onSelect(index);
    }

    var problems : Array<React.ReactNode> = [];

    props.links.forEach((link, index) => {
        problems.push((
            <ListItem
                key={index}
                button
                selected={selectedIndex === index}
                onClick={() => onClick(index)}>
                <ListItemText primary={link.name} />
            </ListItem>
        ));
    });

    return (
        <List component="nav" className={classes.root}>
            {problems}
        </List>
    );

};