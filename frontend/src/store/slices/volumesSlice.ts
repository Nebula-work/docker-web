import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {getVolumes} from "@/api/volume/volumeService.ts";

export interface Volume {
    id: string;
    name: string;
    driver: string;
    mountPoint: string;
    created: string;
    size: string;
}

interface VolumesState {
    volumes: Volume[];
    loading: boolean;
    error: string | null;
}

const initialState: VolumesState = {
    volumes: [],
    loading: false,
    error: null,
};

export const fetchVolumes = createAsyncThunk(
    'volumes/fetchVolumes',
    async () => {
        return await getVolumes();
    }
);

const volumesSlice = createSlice({
    name: 'volumes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVolumes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVolumes.fulfilled, (state, action) => {
                state.loading = false;
                state.volumes = action.payload;
            })
            .addCase(fetchVolumes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch volumes';
            });
    },
});

export default volumesSlice.reducer;