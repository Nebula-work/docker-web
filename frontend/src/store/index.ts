import { configureStore } from '@reduxjs/toolkit';
import containersReducer from './slices/containersSlice';
import imagesReducer from './slices/imagesSlice';
import volumesReducer from './slices/volumesSlice';
import networksReducer from './slices/networksSlice';

export const store = configureStore({
    reducer: {
        containers: containersReducer,
        images: imagesReducer,
        volumes: volumesReducer,
        networks: networksReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;