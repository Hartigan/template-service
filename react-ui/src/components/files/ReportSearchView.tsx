import * as React from 'react'
import { makeStyles, Box, Container } from '@material-ui/core';
import { UserId } from '../../models/Identificators';
import UserSearchView from '../common/UserSearchView';
import { UserService } from '../../services/UserService';
import SearchField from '../common/SearchField';
import { SearchNavigationView } from '../common/SearchNavigationView';
import { Report } from '../../models/Report';
import { ExaminationService } from '../../services/ExaminationService';
import ReportsListView from './ReportsListView';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        maxWidth: 400,
        textAlign: 'left'
    },
    search: {
        padding: "10px",
        width: "100%"
    },
    searchItem: {
        margin: "auto",
        width: "300px"
    },
    titleSearch: {
        margin: "20px 0px 0px 0px",
        width: "100%"
    },
    searchNavigation: {
        margin: "auto",
        width: "100%",
        textAlign: "center"
    },
}));

interface IState {
    pattern: string;
    ownerId: UserId | null;
    reports: Array<Report> | null;
    page: number;
    limit: number;
}

export interface IReportSearchViewProps {
    userService: UserService;
    examinationService: ExaminationService;
    selected: Report | null;
    onSelect: (report: Report) => void;
}

export default function ReportSearchView(props: IReportSearchViewProps) {

    const [ state, setState ] = React.useState<IState>({
        pattern: "",
        ownerId: null,
        reports: null,
        page: 1,
        limit: 10
    });

    const fetchReports = async () => {
        const reports = await props.examinationService
            .getReports(
                state.pattern,
                state.ownerId,
                null,
                (state.page - 1) * state.limit,
                state.limit
            );

        return reports;
    };

    React.useEffect(() => {
        let canUpdate = true;

        if (state.reports === null) {
            fetchReports().then(reports => {
                if (canUpdate) {
                    setState({
                        ...state,
                        reports: reports
                    });
                }
            });
        }

        return () => {
            canUpdate = false;
        };
    });

    const onUserSelected = (ownerId: UserId | null) => {
        setState({
            ...state,
            reports: null,
            ownerId: ownerId
        });
    };

    const onSearchUpdated = (value: string) => {
        setState({
            ...state,
            reports: null,
            pattern: value
        });
    };

    const onPageChanged = (page: number) => {
        setState({
            ...state,
            reports: null,
            page: page
        });
    };

    const onLimitChanged = (limit: number) => {
        setState({
            ...state,
            reports: null,
            limit: limit
        });
    };

    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Container className={classes.search}>
                <div className={classes.searchItem}>
                    <UserSearchView
                        userService={props.userService}
                        onUserSelected={onUserSelected}
                        />
                </div>
                <div className={classes.searchItem}>
                    <SearchField
                        className={classes.titleSearch}
                        placeholder="search..."
                        color="primary"
                        onSearch={onSearchUpdated}
                        />
                </div>
                <SearchNavigationView
                    className={classes.searchNavigation}
                    page={state.page}
                    size={state.limit}
                    onPageChanged={onPageChanged}
                    onSizeChanged={onLimitChanged}
                    />
            </Container>
            <ReportsListView
                reports={state.reports ? state.reports : []}
                selected={props.selected}
                onSelect={props.onSelect}
                />
        </Box>
    );
}