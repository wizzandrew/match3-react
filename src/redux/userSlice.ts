import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginProps, LoginReply, loginUser, logoutUser } from "../shared/api";
import { URL } from "../shared/utils";
import { RootState, AppDispatch } from "./store";

export type InitialState = {
  token: string | null;
  userId: number | null;
};

const initialState: InitialState = {
  token: null,
  userId: null,
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
