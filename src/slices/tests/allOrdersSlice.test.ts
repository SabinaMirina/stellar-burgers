import { allordersSlice, fetchAllOrders } from '../allOrdersSlice';
import { TOrder } from '../../utils/types';

describe('allordersSlice', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  };

  it('должен вернуть начальное состояние', () => {
    const state = allordersSlice.reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('должен обрабатывать экшен pending (запрос начат)', () => {
    const state = allordersSlice.reducer(initialState, {
      type: fetchAllOrders.pending.type
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
    const payload = {
      orders,
      total: 1,
      totalToday: 1
    };
    const state = allordersSlice.reducer(initialState, {
      type: fetchAllOrders.fulfilled.type,
      payload
    });
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(orders);
    expect(state.total).toBe(1);
    expect(state.totalToday).toBe(1);
  });

  it('должен обрабатывать экшен rejected (ошибка запроса)', () => {
    const errorMessage = 'Failed to fetch orders';
    const state = allordersSlice.reducer(initialState, {
      type: fetchAllOrders.rejected.type,
      payload: errorMessage
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
