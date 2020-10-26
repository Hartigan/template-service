import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Head } from '../../../models/Head';
import { HeadId, SubmissionId, UserId } from '../../../models/Identificators';
import { ProblemSetPreview } from '../../../models/ProblemSetPreview';
import { SearchInterval } from '../../../models/SearchInterval';
import { Submission } from '../../../models/Submission';
import { examinationService } from '../../../Services';

export interface ITrainTabState {
    submissions: {
        data: Array<SubmissionId>;
        loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    };
    problemSets: {
        data: Array<{ head: Head; preview: ProblemSetPreview; }>;
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
    submission: { open: false; } | { open: true; data: Submission; };
};

export const fetchSubmissions = createAsyncThunk(
    'tabs/train/fetchSubmissions',
    async () => {
        const submissions = await examinationService.getSubmissions();
        return submissions;
    }
);

export const openSubmission = createAsyncThunk(
    'tabs/train/openSubmission',
    async (id: SubmissionId) => {
        const submission = await examinationService.getSubmission(id);
        return submission;
    }
);

export const startSubmission = createAsyncThunk(
    'tabs/train/startSubmission',
    async (headId: HeadId) => {
        const result = await examinationService.start(headId);
        const submission = await examinationService.getSubmission(result.id);
        return submission;
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
    const problemSets = await examinationService.getProblemSets(
            params.isPublic,
            params.pattern,
            params.tags,
            params.authorId,
            params.problemsCount,
            params.duration,
            params.offset,
            params.limit 
        );

    const result = await Promise.all(
        problemSets.map(
            head =>
                examinationService
                    .getProblemSetPreview(head.commit.id)
                    .then(preview => {
                        return { head: head, preview: preview }
                    })
        )
    );

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
    } as ITrainTabState,
    reducers: {
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
        updateProblemsDuration: (state, action: PayloadAction<SearchInterval<number> | null>) => {
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
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchSubmissions.fulfilled, (state, action: PayloadAction<Array<SubmissionId>>) => {
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
            .addCase(fetchProblemSets.fulfilled, (state, action: PayloadAction<Array<{ head: Head; preview: ProblemSetPreview; }>>) => {
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
            .addCase(openSubmission.fulfilled, (state, action: PayloadAction<Submission>) => {
                state.submission = {
                    open: true,
                    data: action.payload,
                }
            })
            .addCase(startSubmission.fulfilled, (state, action: PayloadAction<Submission>) => {
                state.submission = {
                    open: true,
                    data: action.payload,
                }
            });
    }
});

export const {
    updatePattern,
    updateAuthor,
    updateIsPublic,
    updateTags,
    updateAdvanced,
    updateProblemsCount,
    updateProblemsDuration,
    updatePage,
    updateLimit,
    closeSubmission,
} = slice.actions;

export const trainTabReducer = slice.reducer;