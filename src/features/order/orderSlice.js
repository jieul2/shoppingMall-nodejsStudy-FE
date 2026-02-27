import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartQty } from "../cart/cartSlice";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// Define initial state
const initialState = {
  orderList: [],
  orderNum: "",
  selectedOrder: {},
  error: "",
  loading: false,
  totalPageNum: 1,
};

// Async thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/order", payload);
      dispatch(getCartQty());
      console.log("오다 넘버", response.data.orderNum);
      return response.data.orderNum;
    } catch (error) {
      const errorMessage =
        error.error || error.message || "주문 생성 중 오류가 발생했습니다.";
      dispatch(
        showToastMessage({
          message: errorMessage,
          status: "error",
        }),
      );
      return rejectWithValue(errorMessage);
    }
  },
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/order/me");
      return response.data.orderList;
    } catch (error) {
      const errorMessage =
        error.error ||
        error.message ||
        "주문 목록을 가져오는 중 오류가 발생했습니다.";
      dispatch(
        showToastMessage({
          message: errorMessage,
          status: "error",
        }),
      );
      return rejectWithValue(errorMessage);
    }
  },
);

export const getOrderList = createAsyncThunk(
  // 관리자 페이지에서 주문 목록 조회
  "order/getOrderList",
  async (query, { rejectWithValue, dispatch }) => {
    try {
      console.log("주문 목록 요청", query);
      const response = await api.get("/order", { params: query });
      console.log("주문 목록 응답", response);

      return {
        orderList: response.data.orderList,
        totalPageNum: response.data.totalPageNum,
      };
    } catch (error) {
      const errorMessage =
        error.error ||
        error.message ||
        "주문 목록을 가져오는 중 오류가 발생했습니다.";
      dispatch(
        showToastMessage({
          message: errorMessage,
          status: "error",
        }),
      );
      return rejectWithValue(errorMessage);
    }
  },
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/order/${id}`, { status });

      dispatch(
        showToastMessage({
          message: "주문 상태가 성공적으로 업데이트되었습니다.",
          status: "success",
        }),
      );
      return response.data.order;
    } catch (error) {
      const errorMessage =
        error.error ||
        error.message ||
        "주문 상태 업데이트 중 오류가 발생했습니다.";
      dispatch(
        showToastMessage({
          message: errorMessage,
          status: "error",
        }),
      );
      return rejectWithValue(errorMessage);
    }
  },
);

// Order slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.orderNum = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
        state.orderList = [];
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.orderList = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrderList.pending, (state) => {
        state.loading = true;
        state.orderList = [];
      })
      .addCase(getOrderList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.orderList = action.payload.orderList;
        state.totalPageNum = action.payload.totalPageNum;
      })
      .addCase(getOrderList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        const updatedOrder = action.payload;
        const index = state.orderList.findIndex(
          (order) => order._id === updatedOrder._id,
        );
        if (index !== -1) {
          state.orderList[index] = updatedOrder;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
