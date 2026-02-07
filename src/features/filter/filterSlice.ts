import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  minPrice: string;
  maxPrice: string;
  rating: number | null;
  distance: string | null;
  searchQuery: string;
}

const initialState: FilterState = {
  minPrice: '',
  maxPrice: '',
  rating: null,
  distance: null,
  searchQuery: '',
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setMinPrice: (state, action: PayloadAction<string>) => {
      state.minPrice = action.payload;
    },
    setMaxPrice: (state, action: PayloadAction<string>) => {
      state.maxPrice = action.payload;
    },
    setRating: (state, action: PayloadAction<number | null>) => {
      state.rating = action.payload;
    },
    setDistance: (state, action: PayloadAction<string | null>) => {
      state.distance = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setMinPrice,
  setMaxPrice,
  setRating,
  setDistance,
  setSearchQuery,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
