import { configureStore } from "@reduxjs/toolkit";
// This is how you import a reducer, based on the prior export.
import counterReducer from './counterSlice';

const store = configureStore({
    reducer: {
        counter: counterReducer,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;