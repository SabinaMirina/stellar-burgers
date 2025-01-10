import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../utils/types';
import { getFeedsApi } from '../utils/burger-api';

// интерфейс состояния
interface OrdersState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
}

// начальное состояние
const initialState: OrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

// получение всех заказов
export const fetchAllOrders = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void,
  { rejectValue: string }
>('orders/fetchAllOrders', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    if (!data.success) {
      return rejectWithValue('API did not return success');
    }
    return {
      orders: data.orders,
      total: data.total,
      totalToday: data.totalToday
    };
  } catch (error: any) {
    return rejectWithValue(
      typeof error === 'string'
        ? error
        : error.message || 'Failed to fetch all orders'
    );
  }
});

// работа с заказами
export const allordersSlice = createSlice({
  name: 'allOrders',
  initialState,
  reducers: {
    clearOrders(state) {
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || 'Unknown error occurred while fetching orders';
      });
  }
});

export const { clearOrders } = allordersSlice.actions;
