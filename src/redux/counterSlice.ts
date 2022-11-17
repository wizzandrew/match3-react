import InitialState, {UpdateCounterAction} from "./counter";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState : InitialState = {
    value: 0
};

export const counterSlice = createSlice({
    name: UpdateCounterAction,
    initialState: initialState,
    reducers: {
        increment : (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value += 1;
        }
    }
});

// Action creators are generated for each case reducer function
export const {increment} = counterSlice.actions;

// You must export the reducer as follows for it to be able to be read by the store
export default counterSlice.reducer;