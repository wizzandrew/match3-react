import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "./store";
import * as Board from '../model/board';


export type InitialState<T> = {
    board: Board.Board<T> | null;
    currentMove: Board.Position | null;
    score: number;
    moveCountdown: number;
    moveNotification: string;
}

const initialState : InitialState<string> = {
    board: null,
    currentMove: null,
    score: 0,
    moveCountdown: 0,
    moveNotification: ""
};

const generator = Board.CyclicGenerator('ABCD');

const boardSlice = createSlice({
    name: "board",
    initialState: initialState,
    reducers: {
        createBoard(state) {
            state.board = Board.create(generator, 4, 4);
            state.currentMove = null;
            state.score = 0;
            state.moveCountdown = 10;
            state.moveNotification = "";
        },
        setCurrentMove(state, action: PayloadAction<string>) {
            
            //extract data
            const move = action.payload;
            const _move: Board.Position = {row: Number(move.charAt(0)), col: Number(move.charAt(1))};

            //manage move1, move2
            if(state.currentMove === null) {
                state.currentMove = _move;
            }
            else {
                //move countdown
                state.moveCountdown -= 1;

                //find out if legal move
                const canMove = Board.canMove(state.board, state.currentMove, _move);

                //manage legal move
                if(canMove.canMove) {
                    const result = Board.move(generator, state.board, state.currentMove, _move);
                    const resultEffects = result.effects.filter(effect => effect.kind === 'Match');

                    //fill up moveNotification state
                    let notification = "";
                    resultEffects.forEach(effect => {
                        notification += `Match: ${effect.match.matched}  `;
                    });
                    state.moveNotification = notification;

                    console.log("match effects: " + resultEffects.length);
                    state.board = result.board;
                    state.score += resultEffects.length;
                }
                else {
                    state.moveNotification = "No Matches";
                }

                //set current move to default
                state.currentMove = null;

                //check moveCountdown
                if(state.moveCountdown === 0) gameOver({board: state});;
            }

        },
        finishGame(state) {
            gameOver({board: state});
        }

    }
});

export const {createBoard, setCurrentMove, finishGame} = boardSlice.actions;
export default boardSlice.reducer;

function gameOver(state: RootState) {
    alert("Game Over! Score:" + state.board.score);
    state.board.board = null;
    state.board.currentMove = null;
    state.board.score = 0;
    state.board.moveCountdown = 0;
    state.board.moveNotification = "";
}