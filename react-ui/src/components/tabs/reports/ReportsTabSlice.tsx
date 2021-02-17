import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ReportModel } from '../../../models/domain';
import { ReportId, UserId } from '../../../models/Identificators';
import { SearchInterval } from '../../../models/SearchInterval';
import { DateInterval } from '../../../protobuf/domain_pb';
import { GetReportsRequest } from '../../../protobuf/examination_pb';
import Services from '../../../Services';
import { toStringValue, tryMap } from '../../utils/Utils';

export interface IReportsTabState {
    reports: Array<ReportModel>;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    search: {
        userId: UserId | null;
        pattern: string;
        advanced: boolean;
        date: SearchInterval<number> | null;
        page: number;
        limit: number;
    },
    share: { open: false; } | { open: true; reportId: ReportId; };
    report: { open: false; } | { open: true; report: ReportModel; };
};

export const fetchReports = createAsyncThunk(
        'tabs/reports/fetchReports',
        async (params: { pattern: string | null, userId: UserId | null, date: SearchInterval<Date> | null, offset: number, limit: number }) => {
        const request = new GetReportsRequest();
        request.setPattern(toStringValue(params.pattern));
        request.setUserId(toStringValue(params.userId));
        request.setDateInterval(
            tryMap(params.date, x => {
                const result = new DateInterval()
                result.setStart(x.from.getUTCSeconds());
                result.setEnd(x.to.getUTCSeconds());
                return result;
            })
        );
        request.setOffset(params.offset);
        request.setLimit(params.limit);
        const reply = await Services.examinationService.getReports(request);
        const error = reply.getError();
        if (error) {
            Services.logger.error(error.getDescription());
        }
        return reply.getReports()?.getReportsList()?.map(x => x.toObject()) ?? [];
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
        },
        report: {
            open: false,
        }
    } as IReportsTabState,
    reducers: {
        openReportsTab: (state) => {
            state.reports = [];
            state.loading = 'idle';
            state.share = {
                open: false,
            };
            state.report = {
                open: false,
            }
        },
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
        updateDate: (state, action: PayloadAction<SearchInterval<number> | null>) => {
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
        openReport: (state, action: PayloadAction<ReportModel>) => {
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
            .addCase(fetchReports.fulfilled, (state, action) => {
                state.reports = action.payload;
                state.loading = 'succeeded';
            })
            .addCase(fetchReports.pending, (state, action) => {
                state.loading = 'pending';
            });
    }
});

export const {
    openReportsTab,
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