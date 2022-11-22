import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "./store";
import * as Board from '../model/board';


export type InitialState<T> = {
    generator: Board.Generator<T>;
    board: Board.Board<T> | null
}

const initialState : InitialState<string> = {
    generator: Board.CyclicGenerator('ABCD'),
    board: null
};

const boardSlice = createSlice({
    name: "board",
    initialState: initialState,
    reducers: {
        createBoard(state) {
            state.board = Board.create(state.generator, 4, 4);
            console.log(state.board)
        }
    }
});

export const {createBoard} = boardSlice.actions;
export default boardSlice.reducer;