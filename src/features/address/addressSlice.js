import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// 주소 목록 가져오기
export const getAddressList = createAsyncThunk(
  "address/getAddressList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/address");
      return response.data.addresses;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  },
);

// 새 주소 추가하기
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/address", formData);
      dispatch(
        showToastMessage({
          message: "주소가 추가되었습니다.",
          status: "success",
        }),
      );
      dispatch(getAddressList()); // 목록 새로고침
      return response.data.newAddress;
    } catch (error) {
      dispatch(showToastMessage({ message: error.error, status: "error" }));
      return rejectWithValue(error.error);
    }
  },
);

// 주소 삭제하기
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/address/${id}`);
      dispatch(
        showToastMessage({
          message: "주소가 삭제되었습니다.",
          status: "success",
        }),
      );
      dispatch(getAddressList());
      return id;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  },
);

// 주소 수정하기
export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/address/${id}`, formData);
      dispatch(
        showToastMessage({
          message: "주소가 수정되었습니다.",
          status: "success",
        }),
      );
      dispatch(getAddressList());
      return response.data.updatedAddress;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  },
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addressList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAddressList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAddressList.fulfilled, (state, action) => {
        state.loading = false;
        const rawData = action.payload;

        // 1. 각 객체의 addressList[0]이 기본 배송지인지 확인하고 객체 간 순서를 바꿉니다.
        const processedData = [...rawData].sort((a, b) => {
          // 각 문서의 첫 번째 주소 객체에서 isDefault를 확인
          const aDefault = a.addressList?.[0]?.isDefault ? 1 : 0;
          const bDefault = b.addressList?.[0]?.isDefault ? 1 : 0;

          return bDefault - aDefault; // 기본 배송지가 있는 문서가 위로
        });

        state.addressList = processedData;
        state.error = null;
      })

      .addCase(getAddressList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;
