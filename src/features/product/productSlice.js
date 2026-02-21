import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// 비동기 액션 생성
export const getProductList = createAsyncThunk(
  "products/getProductList",
  async (query, { rejectWithValue }) => {
    try {
      console.log("상품 목록 요청:", query);
      const response = await api.get("/product", { params: { ...query } });
      console.log("상품 목록 응답:", response);
      if (response.status !== 200) throw new Error("상품 목록 가져오기 실패");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.error || "상품 목록을 가져오는 중 오류가 발생했습니다.",
      );
    }
  },
);

export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/product/${id}`);
      if (response.status !== 200)
        throw new Error("상품 상세 정보 가져오기 실패");
      return response.data.product;
    } catch (error) {
      return rejectWithValue(
        error.error || "상품 상세 정보를 가져오는 중 오류가 발생했습니다.",
      );
    }
  },
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/product", formData);
      if (response.status !== 200) throw new Error("상품 생성 실패");
      dispatch(
        showToastMessage({
          message: "상품이 성공적으로 생성되었습니다.",
          status: "success",
        }),
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.error || "상품 생성 중 오류가 발생했습니다.",
      );
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/product/${id}`);
      if (response.status !== 200) throw new Error("상품 삭제 실패");
      dispatch(
        showToastMessage({
          message: "상품이 성공적으로 삭제되었습니다.",
          status: "success",
        }),
      );
      dispatch(getProductList({ page: 1 }));
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.error || "상품 삭제 중 오류가 발생했습니다.",
      );
    }
  },
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, ...formData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/product/${id}`, formData);
      if (response.status !== 200) throw new Error("상품 수정 실패");

      dispatch(
        showToastMessage({
          message: "상품이 성공적으로 수정되었습니다.",
          status: "success",
        }),
      );
      dispatch(getProductList({ page: 1 }));
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.error || "상품 수정 중 오류가 발생했습니다.",
      );
    }
  },
);

// 슬라이스 생성
const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    selectedProduct: null,
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state, action) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = true; // 상품 생성 성공 시 다이얼로그를 닫고, 실패시 에러메시지를 보여주기 위해 success 상태 추가
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getProductList.pending, (state, action) => {
        state.loading = true;
        state.error = "";
        state.productList = [];
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload.productList;
        state.error = "";
        state.totalPageNum = action.payload.totalPageNum;
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editProduct.pending, (state, action) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.success = true;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getProductDetail.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(getProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedProduct, setFilteredList, clearError } =
  productSlice.actions;
export default productSlice.reducer;
