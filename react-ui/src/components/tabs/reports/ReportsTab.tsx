import { makeStyles, Grid, Paper, Toolbar, Typography, Switch, Box, Container } from "@material-ui/core";
import React from "react";
import { useDispatch } from 'react-redux'
import { Report } from "../../../models/Report";
import { ReportId, UserId } from "../../../models/Identificators";
import UserSearchView from "../../common/UserSearchView";
import ReportsListView from "../../reports/ReportsListView";
import SearchField from "../../common/SearchField";
import { SearchNavigationView } from "../../common/SearchNavigationView";
import { SearchInterval } from "../../../models/SearchInterval";
import SearchDateIntervalView from "../../common/SearchDateIntervalView";
import { closeReport, closeShare, fetchReports, openReport, openShare, updateAdvanced, updateDate, updateLimit, updatePage, updatePattern, updateUser } from "./ReportsTabSlice";
import ShareReportDialog from "../../reports/ShareReportDialog";
import ReportDialog from "../../common/ReportDialog";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
    reports: {
        width: "80%",
        height: "100%",
        margin: "auto",
    },
    searchContainer: {
        width: "50%",
        margin: "auto",
        display: "flex",
        minWidth: "320px",
        maxWidth: "480px",
        padding: 0
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
    },
    searchToolbar: {
        flexGrow: 1,
    },
    searchField: {
        flexGrow: 1
    },
    list: {
        margin: "auto",
        width: "80%"
    }
}));

export interface IReportsTabProps {
    reports: Array<Report>;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    search : {
        userId: UserId | null;
        pattern: string;
        advanced: boolean;
        date: SearchInterval<Date> | null;
        page: number;
        limit: number;
    },
    share: { open: false; } | { open: true; reportId: ReportId; };
    report: { open: false; } | { open: true; report: Report; };
}

export default function ReportsTab(props: IReportsTabProps) {
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (props.loading === 'idle') {
            dispatch(fetchReports({
                pattern: props.search.pattern,
                userId: props.search.userId,
                date: props.search.date,
                offset: (props.search.page - 1) * props.search.limit,
                limit: props.search.limit
            }));
        }
    });

    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <Grid item className={classes.reports}>
                <Container className={classes.searchContainer}>
                    <Paper className={classes.searchPaper}>
                        <Toolbar className={classes.searchToolbar}>
                            <SearchField
                                className={classes.searchField}
                                placeholder="title..."
                                color="primary"
                                onSearch={(v) => dispatch(updatePattern(v))}
                                />
                        </Toolbar>
                        <Toolbar className={classes.searchToolbar}>
                            <Typography className={classes.searchTitle} color="textSecondary" gutterBottom>
                                Advanced search
                            </Typography>
                            <Switch
                                checked={props.search.advanced}
                                onChange={(_, value) => dispatch(updateAdvanced(value))}
                                color="primary"
                                />
                        </Toolbar>
                        <Box hidden={!props.search.advanced}>
                            <SearchDateIntervalView
                                label="Date"
                                interval={props.search.date}
                                defaultInterval={{from: new Date(), to: new Date() }}
                                onChanged={(value) => dispatch(updateDate(value))}
                                />
                            <UserSearchView
                                onUserSelected={(userId) => dispatch(updateUser(userId))}
                                />
                        </Box>
                    </Paper>
                </Container>
                {props.share.open
                    ? <ShareReportDialog
                        open={props.share.open}
                        reportId={props.share.reportId}
                        onClose={() => dispatch(closeShare())}
                        />
                    : null}
                {props.report.open
                    ? <ReportDialog
                        open={props.report.open}
                        report={props.report.report}
                        onClose={() => dispatch(closeReport())}
                        />
                    : null}
                <SearchNavigationView
                    className={classes.searchNavigation}
                    page={props.search.page}
                    size={props.search.limit}
                    onPageChanged={(value) => dispatch(updatePage(value))}
                    onSizeChanged={(value) => dispatch(updateLimit(value))}
                    />
                <ReportsListView
                    reports={props.reports}
                    onOpenReport={(report) => dispatch(openReport(report))}
                    onOpenShare={(reportId) => dispatch(openShare(reportId))}
                    />
            </Grid>
        </Grid>
    );
};