import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {getNetworks} from "@/api/network/networkService.ts";

export interface Network {
    id: string;
    name: string;
    driver: string;
    scope: string;
    created: string;
    internal: boolean;
}

interface NetworksState {
    networks: Network[];
    loading: boolean;
    error: string | null;
}

const initialState: NetworksState = {
    networks: [],
    loading: false,
    error: null,
};

export const fetchNetworks = createAsyncThunk(
    'networks/fetchNetworks',
    async () => {
        return await getNetworks();
    }
);

const networksSlice = createSlice({
    name: 'networks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNetworks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNetworks.fulfilled, (state, action) => {
                state.loading = false;
                state.networks = action.payload;
            })
            .addCase(fetchNetworks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch networks';
            });
    },
});

export default networksSlice.reducer;