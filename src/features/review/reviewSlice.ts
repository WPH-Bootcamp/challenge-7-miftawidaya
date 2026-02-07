import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ReviewState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  restaurantId: string | number | null;
  restaurantName: string | null;
  transactionId: string | null;
  reviewId: string | null;
  menuIds: number[];
  error: string | null;
  rating: number;
  comment: string;
}

const initialState: ReviewState = {
  isOpen: false,
  mode: 'create',
  restaurantId: null,
  restaurantName: null,
  transactionId: null,
  reviewId: null,
  menuIds: [],
  error: null,
  rating: 5,
  comment: '',
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    openReviewModal: (
      state,
      action: PayloadAction<{
        restaurantId: string | number;
        restaurantName: string;
        transactionId?: string;
        menuIds?: number[];
        mode?: 'create' | 'edit';
        reviewId?: string;
        rating?: number;
        comment?: string;
      }>
    ) => {
      state.isOpen = true;
      state.mode = action.payload.mode ?? 'create';
      state.restaurantId = action.payload.restaurantId;
      state.restaurantName = action.payload.restaurantName;
      state.transactionId = action.payload.transactionId ?? null;
      state.menuIds = action.payload.menuIds ?? [];
      state.reviewId = action.payload.reviewId ?? null;
      state.rating = action.payload.rating ?? 5;
      state.comment = action.payload.comment ?? '';
      state.error = null;
    },
    closeReviewModal: (state) => {
      state.isOpen = false;
      state.error = null;
      // We don't clear restaurantId/Name here so they persist if we need to reopen on error
    },
    setReviewError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) {
        state.isOpen = true;
      }
    },
    updateReviewData: (
      state,
      action: PayloadAction<{ rating?: number; comment?: string }>
    ) => {
      if (action.payload.rating !== undefined)
        state.rating = action.payload.rating;
      if (action.payload.comment !== undefined)
        state.comment = action.payload.comment;
    },
    resetReview: (_state) => {
      return initialState;
    },
  },
});

export const {
  openReviewModal,
  closeReviewModal,
  setReviewError,
  updateReviewData,
  resetReview,
} = reviewSlice.actions;
export default reviewSlice.reducer;
