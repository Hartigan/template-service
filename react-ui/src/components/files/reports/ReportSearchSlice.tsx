import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserId } from '../../../models/Identificators';
import { Report } from '../../../models/Report';
import { SearchInterval } from '../../../models/SearchInterval';
import { examinationService } from '../../../Services';

export interface IReportSearchState {
    selected: Report | null;
    search: {
        pattern: string;
        ownerId: UserId | null;
        date: SearchInterval<Date> | null;
        page: number;
        limit: number;
    },
    data: {
        reports: Array<Report>;
        loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    }
};

export const fetchReports = createAsyncThunk(
    `files/reports/fetchReports`,
    async (params: {
        pattern: string | null;
        ownerId: UserId | null;
        date: SearchInterval<Date> | null;
        offset: number;
        limit: number;
    }) => {
        const result = examinationService.getReports(
            params.pattern,
            params.ownerId,
            params.date,
            params.offset,
            params.limit
        );
        return result;
    }
);

const slice = createSlice({
    name: 'report-search',
    initialState: {
        selected: null,
        search: {
            pattern: "",
            ownerId: null,
            date: null,
            page: 1,
            limit: 10,
        },
        data: {
            reports: [],
            loading: 'idle',
        }
    } as IReportSearchState,
    reducers: {
        selectReport: (state, action: PayloadAction<Report>) => {
            state.selected = action.payload;
        },
        setPattern: (state, action: PayloadAction<string>) => {
            state.search = {
                ...state.search,
                pattern: action.payload
            };
            state.data = {
                reports: [],
                loading: 'idle'
            };
        },
        setOwnerId: (state, action: PayloadAction<UserId | null>) => {
            state.search = {
                ...state.search,
                ownerId: action.payload
            };
            state.data = {
                reports: [],
                loading: 'idle'
            };
        },
        setDateInterval: (state, action: PayloadAction<SearchInterval<Date> | null>) => {
            state.search = {
                ...state.search,
                date: action.payload
            };
            state.data = {
                reports: [],
                loading: 'idle'
            };
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.search = {
                ...state.search,
                page: action.payload
            };
            state.data = {
                reports: [],
                loading: 'idle'
            };
        },
        setLimit: (state, action: PayloadAction<number>) => {
            state.search = {
                ...state.search,
                limit: action.payload
            };
            state.data = {
                reports: [],
                loading: 'idle'
            };
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchReports.fulfilled, (state, action: PayloadAction<Array<Report>>) => {
                state.data = {
                    loading: 'succeeded',
                    reports: action.payload,
                }
            })
            .addCase(fetchReports.pending, (state, action) => {
                state.data = {
                    reports: [],
                    loading: 'pending',
                };
            });
    }
});

export const {
    selectReport,
    setPattern,
    setOwnerId,
    setDateInterval,
    setPage,
    setLimit,
} = slice.actions;

export const reportSearchReducer = slice.reducer;