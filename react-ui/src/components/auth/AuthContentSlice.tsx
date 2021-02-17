import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import Services from '../../Services';

export interface IAuthContentState {
    name: string | null;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
    error: string | null
}

export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
    const user = await Services.authService.getUser();
    return user?.profile.name ?? null;
});

const slice = createSlice({
    name: 'auth-content',
    initialState: {
        name: null,
        loading: 'idle',
        error: null
    } as IAuthContentState,
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(fetchUser.fulfilled, (state, action: PayloadAction<string | null>) => {
                state.name = action.payload;
            });
    }
});

export const authReducer = slice.reducer;