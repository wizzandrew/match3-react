import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  LoginProps,
  LoginReply,
  loginUser,
  logoutUser,
  getGames,
  getUserAccount,
  GetAccountProps,
  Account,
} from "../shared/api";
import { URL } from "../shared/utils";
import { Game } from "./boardSlice";
import { RootState, AppDispatch } from "./store";

export type InitialState = {
  token: string | null;
  userId: number | null;
  completedGames: Game[] | null;
  account: Account | null;
};

const initialState: InitialState = {
  token: null,
  userId: null,
  completedGames: null,
  account: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      userLogin.fulfilled,
      (state, action: PayloadAction<LoginReply>) => {
        const { token, userId, error } = action.payload;

        if (token && userId && !error) {
          state.token = token;
          state.userId = userId;
          console.log("User " + userId + " logged with token: " + token);
        } else if (error != null) {
          alert("Login failed: " + error);
        }
      }
    );
    builder.addCase(userLogin.rejected, (state, action) => {
      alert(action.error.message);
    });
    builder.addCase(userLogout.fulfilled, (state) => {
      state.token = null;
      state.userId = null;
      console.log("User logged out");
    });
    builder.addCase(userLogout.rejected, (state) => {
      alert("Failed to logout");
      state.token = null;
      state.userId = null;
    });
    builder.addCase(
      userGames.fulfilled,
      (state, action: PayloadAction<Game[] | null>) => {
        const games = action.payload;
        state.completedGames = games;
      }
    );
    builder.addCase(userGames.rejected, (state, action) => {
      console.log("Failed to fetch games\n" + action.error.message);
      state.completedGames = null;
    });
    builder.addCase(
      userAccount.fulfilled,
      (state, action: PayloadAction<Account | null>) => {
        const account = action.payload;
        state.account = account;
      }
    );
    builder.addCase(userAccount.rejected, (state, action) => {
      console.log("Failed to fetch account\n" + action.error.message);
      state.account = null;
    });
  },
});

export default userSlice.reducer;

export const userLogin = createAsyncThunk(
  "user/login",
  async (login: LoginProps) => {
    const response = await loginUser(login);
    return response;
  }
);

export const userLogout = createAsyncThunk(
  "user/logout",
  async (token: string) => {
    const response = await logoutUser(token);
    return response;
  }
);

export const userGames = createAsyncThunk(
  "user/games",
  async (token: string) => {
    const response = await getGames(token);
    return response;
  }
);

export const userAccount = createAsyncThunk(
  "user/account",
  async (props: GetAccountProps) => {
    const response = await getUserAccount(props);
    return response;
  }
);
