import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ReportId, UserId } from '../../../models/Identificators';
import { Report } from '../../../models/Report';
import { SearchInterval } from '../../../models/SearchInterval';
import { examinationService } from '../../../Services';

export interface IReportsTabState {
    reports: Array<Report>;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    search: {
        userId: UserId | null;
        pattern: string;
        advanced: boolean;
        date: SearchInterval<Date> | null;
        page: number;
        limit: number;
    },
    share: { open: false; } | { open: true; reportId: ReportId; };
    report: { open: false; } | { open: true; report: Report; };
};

export const fetchReports = createAsyncThunk(
        'tabs/reports/fetchReports',
        async (params: { pattern: string | null, userId: UserId | null, date: SearchInterval<Date> | null, offset: number, limit: number }) => {
        const reports = await examinationService.getReports(
                params.pattern,
                params.userId,
                params.date,
                params.offset,
                params.limit
            );
        return reports;
    }
);

const slice = createSlice({
    name: 'reports-tab',
    initialState: {
        reports: [],
        loading: 'idle',
        search: {
            userId: null,
            pattern: "",
            date: null,
            advanced: false,
            page: 1,
            limit: 10
        },
        share: {
            open: false,
            reportId: null,
        },
        report: {
            open: false,
            report: null,
        }
    } as IReportsTabState,
    reducers: {
        updatePattern: (state, action: PayloadAction<string>) => {
            state.loading = 'idle';
            state.search = {
                ...state.search,
                pattern: action.payload
            };
        },
        updateUser: (state, action: PayloadAction<UserId | null>) => {
            state.loading = 'idle';
            state.search = {
                ...state.search,
                userId: action.payload
            };
        },
        updateDate: (state, action: PayloadAction<SearchInterval<Date> | null>) => {
            state.loading = 'idle';
            state.search = {
                ...state.search,
                date: action.payload
            };
        },
        updateAdvanced: (state, action: PayloadAction<boolean>) => {
            state.search = {
                ...state.search,
                advanced: action.payload
            };
        },
        updatePage: (state, action: PayloadAction<number>) => {
            state.loading = 'idle';
            state.search = {
                ...state.search,
                page: action.payload
            };
        },
        updateLimit: (state, action: PayloadAction<number>) => {
            state.loading = 'idle';
            state.search = {
                ...state.search,
                limit: action.payload
            };
        },
        openShare: (state, action: PayloadAction<ReportId>) => {
            state.share = {
                open: true,
                reportId: action.payload,
            };
        },
        closeShare: (state) => {
            state.share = {
                open: false
            };
        },
        openReport: (state, action: PayloadAction<Report>) => {
            state.report = {
                open: true,
                report: action.payload,
            };
        },
        closeReport: (state) => {
            state.report = {
                open: false
            };
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchReports.fulfilled, (state, action: PayloadAction<Report[]>) => {
                state.reports = action.payload;
                state.loading = 'succeeded';
            })
            .addCase(fetchReports.pending, (state, action) => {
                state.loading = 'pending';
            });
    }
});

export const {
    updatePattern,
    updateUser,
    updateDate,
    updateAdvanced,
    updatePage,
    updateLimit,
    openShare,
    closeShare,
    openReport,
    closeReport
} = slice.actions;

export const reportsTabReducer = slice.reducer;