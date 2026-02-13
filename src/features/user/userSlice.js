import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {},
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {},
);

export const logout = () => (dispatch) => {};
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const response = await api.post("/user", { email, name, password });
      // 성공시
      // 1. 회원가입 성공 메시지 토스트 노출

      dispatch(
        showToastMessage({
          message: "회원가입이 완료되었습니다.",
          status: "success",
        }),
      );
      // 2. 로그인 페이지로 이동
      navigate("/login");

      return response.data.data; // 앞에 data는 axios response의 data, 뒤에 data는 API 응답의 data
    } catch (error) {
      // 실패시
      // 1. 에러 토스트 노출
      dispatch(
        showToastMessage({
          message: "회원가입에 실패했습니다.",
          status: "error",
        }),
      );
      // 2. 에러값을 저장한다
      return rejectWithValue(error.error);
    }
  },
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {},
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationError = action.payload;
      });
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
