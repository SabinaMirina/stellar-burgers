import { ingredientsSlice, fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '../../utils/types';

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  it('должен вернуть начальное состояние', () => {
    const state = ingredientsSlice.reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('должен обрабатывать экшен pending (запрос начат)', () => {
    const state = ingredientsSlice.reducer(initialState, {
      type: fetchIngredients.pending.type
    });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать экшен fulfilled (успешный запрос)', () => {
    const ingredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Bun',
        type: 'bun',
        proteins: 10,
        fat: 5,
        carbohydrates: 20,
        calories: 100,
        price: 50,
        image: 'image1',
        image_large: 'image_large1',
        image_mobile: 'image_mobile1'
      }
    ];
    const state = ingredientsSlice.reducer(initialState, {
      type: fetchIngredients.fulfilled.type,
      payload: ingredients
    });
    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(ingredients);
  });

  it('должен обрабатывать экшен rejected (ошибка запроса)', () => {
    const errorMessage = 'Failed to fetch ingredients';
    const state = ingredientsSlice.reducer(initialState, {
      type: fetchIngredients.rejected.type,
      payload: errorMessage
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
