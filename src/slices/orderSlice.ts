import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../utils/types';
import { getOrdersApi } from '../utils/burger-api';

// интерфейс состояния
interface OrdersState {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
}

// начальное состояние
const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null
};

// асинхронное действие для получения заказов
export const fetchOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch orders');
  }
});

// слайс
export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching orders';
      });
  }
});

export default ordersSlice.reducer;
