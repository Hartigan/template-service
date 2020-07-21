import { makeStyles, Grid, Paper, Toolbar, Typography, Switch, Box } from "@material-ui/core";
import React from "react";
import { ExaminationService } from "../../services/ExaminationService";
import { Report } from "../../models/Report";
import { UserId } from "../../models/Identificators";
import { UserService } from "../../services/UserService";
import UserSearchView from "../common/UserSearchView";
import ReportsListView from "../reports/ReportsListView";
import SearchField from "../common/SearchField";
import { SearchNavigationView } from "../common/SearchNavigationView";
import { SearchInterval } from "../../models/SearchInterval";
import SearchDateIntervalView from "../common/SearchDateIntervalView";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
    reports: {
        width: "80%",
        height: "100%",
        margin: "auto",
        padding: "10px"
    },
    userSearch: {
        margin: "auto",
        width: "320px",
    },
    titleSearch: {
        width: "320px",
        marginTop: "12px",
        marginBottom: "12px",
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex"
    },
    searchNavigation: {
        margin: "auto",
        width: "auto"
    },
    searchTitle: {
        flexGrow: 1,
        fontSize: 14,
    },
    searchPaper: {
        flexGrow: 1,
        padding: "12px",
        width: "50%",
        margin: "auto",
        display: "flex-inline",
        minWidth: "320px",
        maxWidth: "480px",
    },
    searchToolbar: {
        flexGrow: 1,
    },
    searchField: {
        width: "100%"
    },
    list: {
        margin: "auto",
        width: "80%"
    }
}));

interface IState {
    reports: Array<Report> | null;
    search : {
        userId: UserId | null;
        pattern: string;
        advanced: boolean;
        date: SearchInterval<Date> | null;
        page: number;
        limit: number;
    }
}

export interface IReportsTabProps {
    examinationService: ExaminationService;
    userService: UserService;
}

export default function ReportsTab(props: IReportsTabProps) {

    const [ state, setState ] = React.useState<IState>({
        reports: null,
        search: {
            userId: null,
            pattern: "",
            date: null,
            advanced: false,
            page: 1,
            limit: 10
        }
    });

    const fetchReports = async () => {
        const reportIds = await props.examinationService.getReports(
            state.search.pattern,
            state.search.userId,
            state.search.date,
            (state.search.page - 1) * state.search.limit,
            state.search.limit
        );

        let reports = await Promise.all(reportIds.map(id => props.examinationService.getReport(id)));

        setState({
            ...state,
            reports: reports,
        });
    };

    React.useEffect(() => {
        if (state.reports === null) {
            fetchReports();
        }
    });

    const onSearchUpdated = (value: string) => {
        setState({
            ...state,
            reports: null,
            search: {
                ...state.search,
                pattern: value,
            }
        })
    };

    const onUserChanged = (userId: UserId | null) => {
        setState({
            ...state,
            reports: null,
            search: {
                ...state.search,
                userId: userId,
            }
        })
    };

    const onDateChanged = (date: SearchInterval<Date> | null) => {
        setState({
            ...state,
            reports: null,
            search: {
                ...state.search,
                date: date,
            }
        })
    };

    const onAdvancedSearchChanged = (value: boolean) => {
        setState({
            ...state,
            search: {
                ...state.search,
                advanced: value
            }
        });
    };

    const onPageChanged = (page: number) => {
        setState({
            ...state,
            reports: null,
            search: {
                ...state.search,
                page: page
            }
        })
    };

    const onLimitChanged = (limit: number) => {
        setState({
            ...state,
            reports: null,
            search: {
                ...state.search,
                limit: limit
            }
        })
    };

    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <Grid item className={classes.reports}>
                <Paper className={classes.searchPaper}>
                    <Toolbar className={classes.searchToolbar}>
                        <SearchField
                            className={classes.searchField}
                            placeholder="title..."
                            color="primary"
                            onSearch={(v) => onSearchUpdated(v)}
                            />
                    </Toolbar>
                    <Toolbar className={classes.searchToolbar}>
                        <Typography className={classes.searchTitle} color="textSecondary" gutterBottom>
                            Advanced search
                        </Typography>
                        <Switch
                            checked={state.search.advanced}
                            onChange={(_, value) => onAdvancedSearchChanged(value)}
                            color="primary"
                            />
                    </Toolbar>
                    <Box hidden={!state.search.advanced}>
                        <SearchDateIntervalView
                            label="Date"
                            interval={state.search.date}
                            defaultInterval={{from: new Date(), to: new Date() }}
                            onChanged={onDateChanged}
                            />
                        <UserSearchView
                            userService={props.userService}
                            onUserSelected={onUserChanged}
                            />
                    </Box>
                </Paper>
                <SearchNavigationView
                    className={classes.searchNavigation}
                    page={state.search.page}
                    size={state.search.limit}
                    onPageChanged={onPageChanged}
                    onSizeChanged={onLimitChanged}
                    />
                <ReportsListView
                    examinationService={props.examinationService}
                    userService={props.userService}
                    reports={state.reports ? state.reports : []}
                    />
            </Grid>
        </Grid>
    );
};