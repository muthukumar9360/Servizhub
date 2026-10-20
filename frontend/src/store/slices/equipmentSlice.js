import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  equipments: [],
  myEquipments: [],
  categories: [],
  currentEquipment: null,
  loading: false,
  error: null,
  filters: {
    q: "",
    category: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    condition: "",
    availabilityStatus: "",
  },
  pagination: {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  },
};

const equipmentSlice = createSlice({
  name: "equipment",
  initialState,
  reducers: {
    setEquipmentLoading: (state, action) => {
      state.loading = action.payload;
    },
    setEquipmentError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setEquipments: (state, action) => {
      state.equipments = action.payload.equipments;
      state.pagination = action.payload.pagination;
      state.loading = false;
    },
    setMyEquipments: (state, action) => {
      state.myEquipments = action.payload;
      state.loading = false;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setCurrentEquipment: (state, action) => {
      state.currentEquipment = action.payload;
      state.loading = false;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setEquipmentLoading,
  setEquipmentError,
  setEquipments,
  setMyEquipments,
  setCategories,
  setCurrentEquipment,
  setFilters,
  resetFilters,
} = equipmentSlice.actions;

export default equipmentSlice.reducer;
