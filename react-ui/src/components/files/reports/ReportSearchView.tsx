import * as React from 'react'
import { makeStyles, Box, Container } from '@material-ui/core';
import ReportsListView from './ReportsListView';
import { SearchInterval } from '../../../models/SearchInterval';
import { useDispatch } from 'react-redux';
import { fetchReports, selectReport, setLimit, setOwnerId, setPage, setPattern } from './ReportSearchSlice';
import { UserId } from '../../../models/Identificators';
import SearchField from '../../common/SearchField';
import { SearchNavigationView } from '../../common/SearchNavigationView';
import UserSearchView from '../../common/UserSearchView';
import { ReportModel } from '../../../models/domain';

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

export interface IReportSearchViewProps {
    selected: ReportModel | null;
    search: {
        pattern: string;
        ownerId: UserId | null;
        date: SearchInterval<Date> | null;
        page: number;
        limit: number;
    },
    data: {
        reports: Array<ReportModel>;
        loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    }
}

export default function ReportSearchView(props: IReportSearchViewProps) {

    const dispatch = useDispatch();

    React.useEffect(() => {
        if (props.data.loading === 'idle') {
            dispatch(fetchReports({
                pattern: props.search.pattern,
                ownerId: props.search.ownerId,
                date: null,
                offset: (props.search.page - 1) * props.search.limit,
                limit: props.search.limit
            }));
        }
    });

    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Container className={classes.search}>
                <div className={classes.searchItem}>
                    <UserSearchView
                        onUserSelected={ownerId => dispatch(setOwnerId(ownerId))}
                        />
                </div>
                <div className={classes.searchItem}>
                    <SearchField
                        className={classes.titleSearch}
                        placeholder="search..."
                        color="primary"
                        onSearch={pattern => dispatch(setPattern(pattern))}
                        />
                </div>
                <SearchNavigationView
                    className={classes.searchNavigation}
                    page={props.search.page}
                    size={props.search.limit}
                    onPageChanged={page => dispatch(setPage(page))}
                    onSizeChanged={limit => dispatch(setLimit(limit))}
                    />
            </Container>
            <ReportsListView
                reports={props.data.reports}
                selected={props.selected}
                onSelect={selected => dispatch(selectReport(selected))}
                />
        </Box>
    );
}