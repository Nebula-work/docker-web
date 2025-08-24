import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {getContainers, startContainer, stopContainer} from "@/api/container/containerService.ts";

export interface DockerPort {
    IP?: string;
    PrivatePort?: number;
    PublicPort?: number;
    Type?: string;
}

export interface Container {
    Id: string;
    Names: string[];
    Image: string;
    State: string; // Docker returns states like running, exited, etc.
    Ports: DockerPort[];
    Created: number | string;
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

export const stopContainerThunk = createAsyncThunk(
    'containers/stopContainer',
    async (containerId: string) => {
        console.log("Stopping container with ID:", containerId);
        return await stopContainer(containerId);
    }
);
export const startContainerThunk = createAsyncThunk(
    'containers/startContainer',
    async (containerId: string) => {
        console.log("Starting container with ID:", containerId);
        return await startContainer(containerId);
    }
);
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