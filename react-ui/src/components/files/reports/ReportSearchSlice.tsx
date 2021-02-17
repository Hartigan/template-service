import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ReportModel } from '../../../models/domain';
import { UserId } from '../../../models/Identificators';
import { SearchInterval } from '../../../models/SearchInterval';
import { DateInterval } from '../../../protobuf/domain_pb';
import { GetReportsRequest } from '../../../protobuf/examination_pb';
import Services from '../../../Services';
import { toStringValue, tryMap } from '../../utils/Utils';

export interface IReportSearchState {
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
        const request = new GetReportsRequest();
        request.setPattern(toStringValue(params.pattern));
        request.setUserId(toStringValue(params.ownerId));
        request.setDateInterval(
            tryMap(params.date, x => {
                const result = new DateInterval();
                result.setStart(x.from?.getUTCSeconds() ?? 0)
                result.setEnd(x.to?.getUTCSeconds() ?? 0)
                return result;
            })
        );
        request.setOffset(params.offset)
        request.setLimit(params.limit)
        const reply = await Services.examinationService.getReports(request);

        const error = reply.getError();
        if (error) {
            Services.logger.error(error.getDescription());
        }

        return reply.getReports()?.getReportsList()?.map(x => x.toObject()) ?? [];
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
        selectReport: (state, action: PayloadAction<ReportModel>) => {
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
            .addCase(fetchReports.fulfilled, (state, action: PayloadAction<Array<ReportModel>>) => {
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