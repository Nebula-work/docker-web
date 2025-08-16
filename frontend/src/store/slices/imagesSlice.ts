import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {getImages} from "@/api/image/imageService.ts";

export interface Image {
    id: string;
    repository: string;
    tag: string;
    imageId: string;
    created: string;
    size: string;
}

interface ImagesState {
    images: Image[];
    loading: boolean;
    error: string | null;
}

const initialState: ImagesState = {
    images: [],
    loading: false,
    error: null,
};

export const fetchImages = createAsyncThunk(
    'images/fetchImages',
    async () => {
        return await getImages();
    }
);

const imagesSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchImages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchImages.fulfilled, (state, action) => {
                state.loading = false;
                state.images = action.payload;
            })
            .addCase(fetchImages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch images';
            });
    },
});

export default imagesSlice.reducer;