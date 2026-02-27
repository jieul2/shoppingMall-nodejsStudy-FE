import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size, qty }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/cart", { productId: id, size, qty });
      dispatch(
        showToastMessage({
          message: "상품이 장바구니에 추가되었습니다.",
          status: "success",
        }),
      );
      return response.data.cartItemQty;
    } catch (error) {
      dispatch(
        showToastMessage({
          message:
            error.error || "장바구니에 상품을 추가하는 중 오류가 발생했습니다.",
          status: "error",
        }),
      );
      return rejectWithValue(
        error.error || "상품을 장바구니에 추가하는 중 오류가 발생했습니다.",
      );
    }
  },
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart");

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.error || "장바구니 조회 중 오류가 발생했습니다.",
      );
    }
  },
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete(`/cart/${id}`);
      dispatch(
        showToastMessage({
          message: "장바구니 아이템이 삭제되었습니다.",
          status: "success",
        }),
      );
      dispatch(getCartList());
      return response.data.cartItemQty;
    } catch (error) {
      return rejectWithValue(
        error.error || "장바구니 아이템 삭제 중 오류가 발생했습니다.",
      );
    }
  },
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/${id}`, { qty: value });
      dispatch(
        showToastMessage({
          message: "장바구니 수량이 업데이트되었습니다.",
          status: "success",
        }),
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.error || "장바구니 수량 업데이트 중 오류가 발생했습니다.",
      );
    }
  },
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart/qty");
      return response.data.cartItemQty;
    } catch (error) {
      return rejectWithValue(
        error.error || "장바구니 수량 조회 중 오류가 발생했습니다.",
      );
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "장바구니에 상품을 추가하는 중 오류가 발생했습니다.";
      })
      .addCase(getCartList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartList = action.payload;
        state.totalPrice = action.payload.reduce(
          (total, item) => total + item.productId.price * item.qty,
          0,
        );
      })
      .addCase(getCartList.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "장바구니를 불러오는 중 오류가 발생했습니다.";
      })
      .addCase(getCartQty.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartQty.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload;
      })
      .addCase(getCartQty.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "장바구니 수량을 불러오는 중 오류가 발생했습니다.";
      })
      .addCase(updateQty.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQty.fulfilled, (state, action) => {
        state.loading = false;
        state.cartList = action.payload;
        state.totalPrice = action.payload.reduce(
          (total, item) => total + item.productId.price * item.qty,
          0,
        );
      })
      .addCase(updateQty.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "장바구니 수량을 업데이트하는 중 오류가 발생했습니다.";
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "장바구니 아이템 삭제 중 오류가 발생했습니다.";
      });
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
