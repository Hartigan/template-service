import { makeStyles, Grid, TextField } from "@material-ui/core";
import React from "react";
import { ExaminationService } from "../../services/ExaminationService";
import { Report } from "../../models/Report";
import { UserId } from "../../models/Identificators";
import { UserService } from "../../services/UserService";
import UserSearchView from "../common/UserSearchView";
import ReportsListView from "../reports/ReportsListView";

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
        value: string;
        filtered: Array<Report>;
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
            value: "",
            filtered: []
        }
    });

    const fetchReports = async () => {
        const reportIds = await (state.search.userId
            ? props.examinationService.getSearchReportsByAuthor(state.search.userId)
            : props.examinationService.getReports());

        
        let reports = await Promise.all(reportIds.map(id => props.examinationService.getReport(id)));

        setState({
            ...state,
            reports: reports,
            search: {
                ...state.search,
                filtered: state.search.value
                    ? reports.filter(report => report.problem_set.title.toLowerCase().includes(state.search.value))
                    : reports
            }
        });
    };

    React.useEffect(() => {
        if (state.reports === null) {
            fetchReports();
        }
    });

    const onSearchUpdated = (value: string) => {
        console.log(value);
        if (state.reports === null) {
            return;
        }

        setState({
            ...state,
            search: {
                ...state.search,
                value: value,
                filtered: value
                    ? state.reports.filter(report => report.problem_set.title.toLowerCase().includes(state.search.value))
                    : state.reports
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
                filtered: []
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
                <TextField
                    className={classes.titleSearch}
                    placeholder="search..."
                    color="primary"
                    value={state.search.value}
                    onChange={(e) => onSearchUpdated(e.target.value)}
                    />
                <ReportsListView
                    examinationService={props.examinationService}
                    userService={props.userService}
                    reports={state.search.filtered}
                    />
            </Grid>
        </Grid>
    );
};