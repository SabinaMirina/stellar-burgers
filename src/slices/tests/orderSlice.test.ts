import { ordersSlice, fetchOrders } from '../orderSlice';
import { TOrder } from '../../utils/types';

describe('ordersSlice', () => {
  const initialState = {
    orders: [],
    loading: false,
    error: null
  };

  it('должен вернуть начальное состояние', () => {
    const state = ordersSlice.reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('должен обрабатывать экшен pending (запрос начат)', () => {
    const state = ordersSlice.reducer(initialState, {
      type: fetchOrders.pending.type
    });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать экшен fulfilled (успешный запрос)', () => {
    const orders: TOrder[] = [
      {
        _id: '1',
        status: 'done',
        name: 'Order 1',
        createdAt: '2022-01-01T00:00:00Z',
        updatedAt: '2022-01-01T00:00:00Z',
        number: 1,
        ingredients: ['ingredient1', 'ingredient2']
      }
    ];
    const state = ordersSlice.reducer(initialState, {
      type: fetchOrders.fulfilled.type,
      payload: orders
    });
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(orders);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать экшен rejected (ошибка запроса)', () => {
    const errorMessage = 'Failed to fetch orders';
    const state = ordersSlice.reducer(initialState, {
      type: fetchOrders.rejected.type,
      payload: errorMessage
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
