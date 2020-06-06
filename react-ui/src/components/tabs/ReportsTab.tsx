import { makeStyles, Grid } from "@material-ui/core";
import React from "react";
import { ExaminationService } from "../../services/ExaminationService";
import { Report } from "../../models/Report";
import { UserId } from "../../models/Identificators";
import { UserService } from "../../services/UserService";
import UserSearchView from "../common/UserSearchView";
import ReportsListView from "../reports/ReportsListView";
import SearchField from "../common/SearchField";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
    reports: {
        width: "600px",
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
        margin: "10px",
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
        }
    });

    const fetchReports = async () => {
        const reportIds = await props.examinationService.getReports(state.search.pattern, state.search.userId, 0, 100);

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
        if (state.reports === null) {
            return;
        }

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
                <ReportsListView
                    examinationService={props.examinationService}
                    userService={props.userService}
                    reports={state.reports ? state.reports : []}
                    />
            </Grid>
        </Grid>
    );
};