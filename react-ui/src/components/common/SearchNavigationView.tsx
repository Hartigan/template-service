import React from "react";
import { IconButton, makeStyles, Button, Typography, Container, ContainerProps } from "@material-ui/core";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FirstPageIcon from '@material-ui/icons/FirstPage';

const useStyles = makeStyles(theme => ({
    root: {
        textAlign: "center",
        padding: 0
    },
    page: {
        flexGrow: 1,
        maxWidth: 20,
    },
    navigationButton: {
        flexGrow: 1,
        minWidth: "32px"
    },
    sizeButton: {
        flexGrow: 1,
        minWidth: "32px"
    },
}));

export interface ISearchNavigationViewProps extends ContainerProps {
    page: number;
    size: number;
    onPageChanged: (value: number) => void;
    onSizeChanged: (value: number) => void;
}

export function SearchNavigationView(props: ISearchNavigationViewProps) {

    const { page, size, onPageChanged, onSizeChanged, ...toolbarProps } = props;

    const onBack = () => {
        onPageChanged(page - 1);
    };

    const onNext = () => {
        onPageChanged(page + 1);
    };

    const classes = useStyles();

    return (
        <Container {...toolbarProps}>
            <Container className={classes.root}>
                <IconButton
                    className={classes.navigationButton}
                    disabled={page === 1}
                    onClick={() => onPageChanged(1)}
                    >
                    <FirstPageIcon />
                </IconButton>
                <IconButton
                    className={classes.navigationButton}
                    disabled={page === 1}
                    onClick={() => onBack()}
                    >
                    <ArrowBackIcon />
                </IconButton>
                <Typography
                    className={classes.page}
                    variant="body2"
                    component="span"
                    >
                    {page}
                </Typography>
                <IconButton
                    className={classes.navigationButton}
                    onClick={() => onNext()}
                    >
                    <ArrowForwardIcon />
                </IconButton>
                <Button
                    size="small"
                    className={classes.sizeButton}
                    disabled={size === 10}
                    onClick={() => onSizeChanged(10)}
                    >
                    10
                </Button>
                <Button
                    size="small"
                    className={classes.sizeButton}
                    disabled={size === 20}
                    onClick={() => onSizeChanged(20)}
                    >
                    20
                </Button>
                <Button
                    size="small"
                    className={classes.sizeButton}
                    disabled={size === 50}
                    onClick={() => onSizeChanged(50)}
                    >
                    50
                </Button>
            </Container>
        </Container>
    );
}
