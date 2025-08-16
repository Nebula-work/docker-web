import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {getContainers} from "@/api/container/containerService.ts";

export interface Container {
    id: string;
    name: string;
    image: string;
    status: 'running' | 'stopped' | 'error';
    ports: string[];
    created: string;
}

interface ContainersState {
    containers: Container[];
    loading: boolean;
    error: string | null;
}

const initialState: ContainersState = {
    containers: [],
    loading: false,
    error: null,
};

export const fetchContainers = createAsyncThunk(
    'containers/fetchContainers',
    async () => {
        return await getContainers();
    }
);

const containersSlice = createSlice({
    name: 'containers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchContainers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContainers.fulfilled, (state, action) => {
                console.log("containers",action.payload)
                state.loading = false;
                state.containers = action.payload;
            })
            .addCase(fetchContainers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch containers';
            });
    },
});

export default containersSlice.reducer;