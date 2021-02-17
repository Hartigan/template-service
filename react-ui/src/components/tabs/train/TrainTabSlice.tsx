import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import Services from '../../../Services';
import { HeadModel, ProblemSetPreviewModel, ReportModel, SubmissionModel, SubmissionPreviewModel } from '../../../models/domain';
import { HeadId, ReportId, SubmissionId, UserId } from '../../../models/Identificators';
import { SearchInterval } from '../../../models/SearchInterval';
import { Int32Interval, UInt32Interval } from '../../../protobuf/domain_pb';
import { GetProblemSetsPreviewsReply, GetProblemSetsPreviewsRequest, GetProblemSetsRequest, GetReportRequest, GetSubmissionRequest, GetSubmissionsPreviewsReply, GetSubmissionsPreviewsRequest, GetSubmissionsRequest, StartSubmissionRequest } from '../../../protobuf/examination_pb';
import { toStringValue, tryMap } from '../../utils/Utils';

export interface ITrainTabState {
    submissions: {
        data: Array<SubmissionPreviewModel>;
        loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    };
    problemSets: {
        data: Array<{ head: HeadModel; preview: ProblemSetPreviewModel; }>;
        loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    }    
    search: {
        authorId: UserId | null;
        isPublic: boolean;
        tags: Array<string>;
        pattern: string;
        advanced: boolean;
        problemsCount: SearchInterval<number> | null;
        problemsDuration: SearchInterval<number> | null;
        page: number;
        limit: number;
    },
    submission: { open: false; } | { open: true; data: SubmissionModel; };
    report: { open: false; } | { open: true; data: ReportModel; }
};

export const fetchSubmissions = createAsyncThunk(
    'tabs/train/fetchSubmissions',
    async () => {
        const request = new GetSubmissionsRequest();
        const reply = await Services.examinationService.getSubmissions(request);
        const error = reply.getError();
        if (error) {
            Services.logger.error(error.getDescription());
        }
        const submissionIds = reply.getSubmissions()?.getSubmissionIdsList() ?? [];
        const previewsRequest = new GetSubmissionsPreviewsRequest();
        previewsRequest.setSubmissionIdsList(submissionIds);
        const previewReply = await Services.examinationService.getSubmissionsPreviews(previewsRequest);

        const result : Array<SubmissionPreviewModel> = [];

        previewReply.getPreviewsList().forEach(entry => {
            if (entry.getStatus() !== GetSubmissionsPreviewsReply.Status.OK) {
                Services.logger.error(`Submission entry returned with status = ${entry.getStatus()}`);
            }

            const preview = entry.getPreview()?.toObject();
            if (preview) {
                result.push(preview);
            }
        });

        return result;
    }
);

export const openSubmission = createAsyncThunk(
    'tabs/train/openSubmission',
    async (id: SubmissionId) => {
        const request = new GetSubmissionRequest();
        request.setSubmissionId(id);
        const reply = await Services.examinationService.getSubmission(request);
        const error = reply.getError();
        if (error) {
            Services.logger.error(error.getDescription());
        }
        return reply.getSubmission()?.toObject();
    }
);

export const startSubmission = createAsyncThunk(
    'tabs/train/startSubmission',
    async (headId: HeadId) => {
        const request = new StartSubmissionRequest();
        request.setProblemSetHeadId(headId);
        const reply = await Services.examinationService.startSubmission(request);
        const error = reply.getError();
        if (error) {
            Services.logger.error(error.getDescription());
        }

        const submissionId = reply.getSubmissionId();
        if (!submissionId) {
            return null;
        }
        const submissionRequest = new GetSubmissionRequest();
        submissionRequest.setSubmissionId(submissionId);
        const submissionReply = await Services.examinationService.getSubmission(submissionRequest);

        const submissionError = reply.getError();
        if (submissionError) {
            Services.logger.error(submissionError.getDescription());
        }
        return submissionReply.getSubmission()?.toObject() ?? null;
    }
);

export const openReport = createAsyncThunk(
    'tabs/train/openReport',
    async (id: ReportId) => {
        const request = new GetReportRequest();
        request.setReportId(id);
        const reply = await Services.examinationService.getReport(request);
        const error = reply.getError();
        if (error) {
            Services.logger.error(error.getDescription());
        }
        return reply.getReport()?.toObject() ?? null;
    }
);

export const fetchProblemSets = createAsyncThunk(
    'tabs/train/fetchProblemSets',
    async (params: {
            isPublic: boolean,
            pattern: string | null,
            tags: Array<string> | null,
            authorId: UserId | null,
            problemsCount: SearchInterval<number> | null,
            duration: SearchInterval<number> | null,
            offset: number,
            limit: number 
        }) => {
        const request = new GetProblemSetsRequest()
        request.setIsPublic(params.isPublic);
        request.setPattern(toStringValue(params.pattern));
        request.setTagsList(params.tags ?? []);
        request.setAuthorId(toStringValue(params.authorId));
        request.setProblemsCount(
            tryMap(params.problemsCount, x => {
                const result = new UInt32Interval();
                result.setStart(x.from);
                result.setEnd(x.to);
                return result;
            })
        );
        request.setDurationS(
            tryMap(params.duration, x => {
                const result = new Int32Interval();
                result.setStart(x.from);
                result.setEnd(x.to);
                return result;
            })
        );
        request.setOffset(params.offset);
        request.setLimit(params.limit);
        const reply = await Services.examinationService.getProblemSets(request);

        const error = reply.getError();
        if (error) {
            Services.logger.error(error.getDescription());
        }

        const heads = reply.getHeads()?.getHeadsList()?.map(x => x.toObject()) ?? [];
        const commitIds = heads.map(x => x.commit?.id ?? "");
        const previewsRequest = new GetProblemSetsPreviewsRequest();
        previewsRequest.setCommitIdsList(commitIds);
        const fakePreview : ProblemSetPreviewModel = {
            id: "fake",
            title: "",
            problemsCount: 0,
            durationS: 0,
            author: undefined,
        };
        const previewsReply = await Services.examinationService.getProblemSetsPreviews(previewsRequest);
        const entries = previewsReply.getPreviewsList()?.map(x => x.toObject()) ?? [];

        const result = heads.map(head => {
            const entry = entries.find(x => x.commitId === head.commit?.id);

            if (!entry) {
                Services.logger.error(`Entry with commitId = ${head.commit?.id} not found`);
            }

            if (entry?.status !== GetProblemSetsPreviewsReply.Status.OK) {
                Services.logger.error(`Entry with commitId = ${head.commit?.id} returned with status = ${entry?.status}`);
            }

            const preview = entry?.preview;

            return {
                head: head,
                preview: preview ?? fakePreview
            };
        });

        return result;
    }
);

const slice = createSlice({
    name: 'train-tab',
    initialState: {
        submissions: {
            data: [],
            loading: 'idle',
        },
        problemSets: {
            data: [],
            loading: 'idle',
        },
        search: {
            authorId: null,
            isPublic: true,
            tags: [],
            pattern: "",
            advanced: false,
            problemsCount: null,
            problemsDuration: null,
            page: 1,
            limit: 10,
        },
        submission: { open: false },
        report: { open: false },
    } as ITrainTabState,
    reducers: {
        openTrainTab: (state) => {
            state.submissions = {
                data: [],
                loading: 'idle',
            };
            state.problemSets = {
                data: [],
                loading: 'idle',
            };
            state.submission = {
                open: false,
            };
        },
        updatePattern: (state, action: PayloadAction<string>) => {
            state.problemSets = {
                loading: 'idle',
                data: [],
            };
            state.search = {
                ...state.search,
                pattern: action.payload
            };
        },
        updateAuthor: (state, action: PayloadAction<UserId | null>) => {
            state.problemSets = {
                loading: 'idle',
                data: [],
            };
            state.search = {
                ...state.search,
                authorId: action.payload
            };
        },
        updateIsPublic: (state, action: PayloadAction<boolean>) => {
            state.problemSets = {
                loading: 'idle',
                data: [],
            };
            state.search = {
                ...state.search,
                isPublic: action.payload
            };
        },
        updateTags: (state, action: PayloadAction<Array<string>>) => {
            state.problemSets = {
                loading: 'idle',
                data: [],
            };
            state.search = {
                ...state.search,
                tags: action.payload
            };
        },
        updateAdvanced: (state, action: PayloadAction<boolean>) => {
            state.search = {
                ...state.search,
                advanced: action.payload
            };
        },
        updateProblemsCount: (state, action: PayloadAction<SearchInterval<number> | null>) => {
            state.problemSets = {
                loading: 'idle',
                data: [],
            };
            state.search = {
                ...state.search,
                problemsCount: action.payload
            };
        },
        updateDuration: (state, action: PayloadAction<SearchInterval<number> | null>) => {
            state.problemSets = {
                loading: 'idle',
                data: [],
            };
            state.search = {
                ...state.search,
                problemsDuration: action.payload
            };
        },
        updatePage: (state, action: PayloadAction<number>) => {
            state.problemSets = {
                loading: 'idle',
                data: [],
            };
            state.search = {
                ...state.search,
                page: action.payload
            };
        },
        updateLimit: (state, action: PayloadAction<number>) => {
            state.problemSets = {
                loading: 'idle',
                data: [],
            };
            state.search = {
                ...state.search,
                limit: action.payload
            };
        },
        closeSubmission: (state) => {
            state.submission = {
                open: false,
            };
        },
        closeReport: (state) => {
            state.report = {
                open: false,
            };
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchSubmissions.fulfilled, (state, action) => {
                state.submissions = {
                    loading: 'succeeded',
                    data: action.payload,
                };
            })
            .addCase(fetchSubmissions.pending, (state, action) => {
                state.submissions = {
                    loading: 'pending',
                    data: [],
                };
            })
            .addCase(fetchProblemSets.fulfilled, (state, action) => {
                state.problemSets = {
                    loading: 'succeeded',
                    data: action.payload,
                };
            })
            .addCase(fetchProblemSets.pending, (state, action) => {
                state.problemSets = {
                    loading: 'pending',
                    data: [],
                };
            })
            .addCase(openReport.fulfilled, (state, action) => {
                if (action.payload) {
                    state.report = {
                        open: true,
                        data: action.payload,
                    }
                }
            })
            .addCase(openSubmission.fulfilled, (state, action) => {
                if (action.payload) {
                    state.submission = {
                        open: true,
                        data: action.payload,
                    }
                }
            })
            .addCase(startSubmission.fulfilled, (state, action) => {
                if (action.payload) {
                    state.submission = {
                        open: true,
                        data: action.payload,
                    }
                }
            });
    }
});

export const {
    openTrainTab,
    updatePattern,
    updateAuthor,
    updateIsPublic,
    updateTags,
    updateAdvanced,
    updateProblemsCount,
    updateDuration,
    updatePage,
    updateLimit,
    closeSubmission,
    closeReport
} = slice.actions;

export const trainTabReducer = slice.reducer;