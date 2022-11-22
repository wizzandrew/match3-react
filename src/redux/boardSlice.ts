import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "./store";
import * as Board from '../model/board';


export type InitialState<T> = {
    board: Board.Board<T> | null;
    currentMove: Board.Position | null;
}

const initialState : InitialState<string> = {
    board: null,
    currentMove: null
};

const generator = Board.CyclicGenerator('ABCD');

const boardSlice = createSlice({
    name: "board",
    initialState: initialState,
    reducers: {
        createBoard(state) {
            state.board = Board.create(generator, 4, 4);
            console.log(state.board)
        },
        setCurrentMove(state, action: PayloadAction<string>) {
            const move = action.payload;
            const _move: Board.Position = {row: Number(move.charAt(0)), col: Number(move.charAt(1))};

            if(state.currentMove === null) {
                state.currentMove = _move;
            }
            else {
                const canMove = Board.canMove(state.board, state.currentMove, _move);
                if(canMove.canMove) {
                    const result = Board.move(generator, state.board, state.currentMove, _move);
                    console.log("match effects: " + result.effects.filter(effect => effect.kind === 'Match').length);
                    state.board = result.board;
                }
                state.currentMove = null;
            }
        }

    }
});

export const {createBoard, setCurrentMove} = boardSlice.actions;
export default boardSlice.reducer;