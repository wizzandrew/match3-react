import { configureStore } from "@reduxjs/toolkit";
// This is how you import a reducer, based on the prior export.
import boardReducer from './boardSlice';

export const store = configureStore({
    reducer: {
        board: boardReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;