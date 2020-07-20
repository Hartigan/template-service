import { makeStyles, Grid } from "@material-ui/core";
import React from "react";
import { ExaminationService } from "../../services/ExaminationService";
import { Report } from "../../models/Report";
import { UserId } from "../../models/Identificators";
import { UserService } from "../../services/UserService";
import UserSearchView from "../common/UserSearchView";
import ReportsListView from "../reports/ReportsListView";
import SearchField from "../common/SearchField";
import { SearchNavigationView } from "../common/SearchNavigationView";

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
    list: {
        margin: "auto",
        width: "60%"
    }
}));

interface IState {
    reports: Array<Report> | null;
    search : {
        userId: UserId | null;
        pattern: string;
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
            page: 1,
            limit: 10
        }
    });

    const fetchReports = async () => {
        const reportIds = await props.examinationService.getReports(
            state.search.pattern,
            state.search.userId,
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
                <div className={classes.userSearch}>
                    <UserSearchView
                        userService={props.userService}
                        onUserSelected={onUserChanged}
                        />
                </div>
                <SearchField
                    className={classes.titleSearch}
                    placeholder="search..."
                    color="primary"
                    onSearch={(v) => onSearchUpdated(v)}
                    />
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