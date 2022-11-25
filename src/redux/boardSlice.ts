import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "./store";
import { useAppDispatch } from "./hooks";
import * as Board from "../model/board";
import { postGame, patchGame, PatchGame } from "../shared/api";

export type Game = {
  user: number;
  id: number;
  score: number;
  completed: boolean;
};

type UpdateBoardProps = {
  board: Board.Board<string>;
  score: number;
};

export type InitialState<T> = {
  board: Board.Board<T> | null;
  game: Game | null;
  currentMove: Board.Position | null;
  score: number;
  moveCountdown: number;
  moveNotification: string;
};

const initialState: InitialState<string> = {
  board: null,
  game: null,
  currentMove: null,
  score: 0,
  moveCountdown: 0,
  moveNotification: "",
};

export const generator = Board.CyclicGenerator("ABCD");

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
    setCurrentMove(state, action: PayloadAction<Board.Position | null>) {
      const move = action.payload;
      state.currentMove = move;
    },
    updateMoveCountdown(state) {
      state.moveCountdown -= 1;
    },
    setMoveNotifications(
      state,
      action: PayloadAction<Board.Effect<string>[] | null>
    ) {
      const resultEffects = action.payload;

      if (resultEffects !== null) {
        //fill up moveNotification state
        let notification = "";
        resultEffects.forEach((effect) => {
          notification += `Match: ${effect.match.matched}  `;
        });
        state.moveNotification = notification;
      } else {
        state.moveNotification = "No Matches";
      }
    },
    updateBoard(state, action: PayloadAction<UpdateBoardProps>) {
      const { board, score } = action.payload;
      state.board = board;
      state.score += score;
    },
    _setCurrentMove(state, action: PayloadAction<string>) {
      //extract data
      const move = action.payload;
      const _move: Board.Position = {
        row: Number(move.charAt(0)),
        col: Number(move.charAt(1)),
      };

      //manage move1, move2
      if (state.currentMove === null) {
        state.currentMove = _move;
      } else {
        //move countdown
        state.moveCountdown -= 1;

        //find out if legal move
        const canMove = Board.canMove(state.board, state.currentMove, _move);

        //manage legal move
        if (canMove.canMove) {
          const result = Board.move(
            generator,
            state.board,
            state.currentMove,
            _move
          );
          const resultEffects = result.effects.filter(
            (effect) => effect.kind === "Match"
          );

          //fill up moveNotification state
          let notification = "";
          resultEffects.forEach((effect) => {
            notification += `Match: ${effect.match.matched}  `;
          });
          state.moveNotification = notification;

          console.log("match effects: " + resultEffects.length);
          state.board = result.board;
          state.score += resultEffects.length;
        } else {
          state.moveNotification = "No Matches";
        }

        //set current move to default
        state.currentMove = null;
      }
    },
    finishGame(state) {
      gameOver({ board: state, user: null });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(gamePost.fulfilled, (state, action) => {
      const { user, id, score, completed } = action.payload;
      state.game = {
        user: user,
        id: id,
        score: score,
        completed: completed,
      };
    });
    builder.addCase(gamePost.rejected, (state, action) => {
      state.game = null;
      alert("User is not logged in. " + action.error.message);
    });
    builder.addCase(gamePatch.fulfilled, (state) => {
      console.log("game patched successfully");
    });
    builder.addCase(gamePatch.rejected, (state, action) => {
      alert("Error " + action.error.message);
    });
  },
});

export const {
  createBoard,
  _setCurrentMove,
  setCurrentMove,
  updateMoveCountdown,
  setMoveNotifications,
  updateBoard,
  finishGame,
} = boardSlice.actions;
export default boardSlice.reducer;

function gameOver(state: RootState) {
  alert("Game Over! Score:" + state.board.score);
  state.board.board = null;
  state.board.game = null;
  state.board.currentMove = null;
  state.board.score = 0;
  state.board.moveCountdown = 0;
  state.board.moveNotification = "";
}

export const gamePost = createAsyncThunk("game/post", async (token: string) => {
  const response = await postGame(token);
  return response;
});

export const gamePatch = createAsyncThunk(
  "game/patch",
  async (game: PatchGame) => {
    const response = await patchGame(game);
    return response;
  }
);
