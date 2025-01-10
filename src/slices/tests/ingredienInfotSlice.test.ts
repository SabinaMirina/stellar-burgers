import {
  ingredientInfoSlice,
  fetchIngredientsInfo,
  setIngredientData,
  resetIngredientData
} from '../ingredienInfotSlice';
import { TIngredient } from '../../utils/types';

describe('ingredientInfoSlice', () => {
  const initialState = {
    ingredientData: null,
    ingredients: [],
    loading: false,
    error: null
  };

  it('должен вернуть начальное состояние', () => {
    const state = ingredientInfoSlice.reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('должен обрабатывать экшен pending (запрос начат)', () => {
    const state = ingredientInfoSlice.reducer(initialState, {
      type: fetchIngredientsInfo.pending.type
    });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать экшен fulfilled (успешный запрос)', () => {
    const ingredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Ingredient 1',
        type: 'sauce',
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
    const state = ingredientInfoSlice.reducer(initialState, {
      type: fetchIngredientsInfo.fulfilled.type,
      payload: ingredients
    });
    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(ingredients);
  });

  it('должен обрабатывать экшен rejected (ошибка запроса)', () => {
    const errorMessage = 'Failed to fetch ingredients';
    const state = ingredientInfoSlice.reducer(initialState, {
      type: fetchIngredientsInfo.rejected.type,
      payload: errorMessage
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('должен устанавливать активный ингредиент', () => {
    const ingredient: TIngredient = {
      _id: '2',
      name: 'Ingredient 2',
      type: 'bun',
      proteins: 5,
      fat: 2,
      carbohydrates: 10,
      calories: 50,
      price: 20,
      image: 'image2',
      image_large: 'image_large2',
      image_mobile: 'image_mobile2'
    };
    const state = ingredientInfoSlice.reducer(
      initialState,
      setIngredientData(ingredient)
    );
    expect(state.ingredientData).toEqual(ingredient);
  });

  it('должен сбрасывать активный ингредиент', () => {
    const stateWithIngredient = {
      ...initialState,
      ingredientData: {
        _id: '2',
        name: 'Ingredient 2',
        type: 'bun',
        proteins: 5,
        fat: 2,
        carbohydrates: 10,
        calories: 50,
        price: 20,
        image: 'image2',
        image_large: 'image_large2',
        image_mobile: 'image_mobile2'
      }
    };
    const state = ingredientInfoSlice.reducer(
      stateWithIngredient,
      resetIngredientData()
    );
    expect(state.ingredientData).toBeNull();
  });
});
