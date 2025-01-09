import {
  burgerConstructorSlice,
  addIngredient,
  removeIngredient,
  moveIngredient
} from '../constructorSlice';
import { TConstructorIngredient } from '../../utils/types';

describe('burgerConstructorSlice', () => {
  const initialState = {
    constructorItems: {
      bun: null,
      ingredients: []
    },
    orderRequest: false,
    orderModalData: null,
    orderError: null
  };

  it('должен вернуть начальное состояние', () => {
    const state = burgerConstructorSlice.reducer(undefined, { type: '@@INIT' }); // Используем '@@INIT' для корректного начального состояния
    expect(state).toEqual(initialState);
  });

  it('должен обрабатывать экшен добавления ингредиента', () => {
    const ingredient: TConstructorIngredient = {
      id: '1',
      _id: '1',
      name: 'Test Ingredient',
      type: 'main',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 50,
      image: 'image',
      image_large: 'image_large',
      image_mobile: 'image_mobile'
    };

    const state = burgerConstructorSlice.reducer(
      initialState,
      addIngredient(ingredient)
    );
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]).toEqual(ingredient);
  });

  it('должен обрабатывать экшен добавления булки', () => {
    const bun: TConstructorIngredient = {
      id: '1',
      _id: '1',
      name: 'Test Bun',
      type: 'bun',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 50,
      image: 'image',
      image_large: 'image_large',
      image_mobile: 'image_mobile'
    };

    const state = burgerConstructorSlice.reducer(
      initialState,
      addIngredient(bun)
    );
    expect(state.constructorItems.bun).toEqual(bun);
  });

  it('должен обрабатывать экшен удаления ингредиента', () => {
    const ingredient: TConstructorIngredient = {
      id: '1',
      _id: '1',
      name: 'Test Ingredient',
      type: 'main',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 50,
      image: 'image',
      image_large: 'image_large',
      image_mobile: 'image_mobile'
    };

    const stateWithIngredient = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients: [ingredient]
      }
    };

    const state = burgerConstructorSlice.reducer(
      stateWithIngredient,
      removeIngredient(0)
    );

    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('должен обрабатывать экшен изменения порядка ингредиентов', () => {
    const ingredient1: TConstructorIngredient = {
      id: '1',
      _id: '1',
      name: 'Ingredient 1',
      type: 'main',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 50,
      image: 'image1',
      image_large: 'image_large1',
      image_mobile: 'image_mobile1'
    };

    const ingredient2: TConstructorIngredient = {
      id: '2',
      _id: '2',
      name: 'Ingredient 2',
      type: 'main',
      proteins: 15,
      fat: 15,
      carbohydrates: 15,
      calories: 150,
      price: 75,
      image: 'image2',
      image_large: 'image_large2',
      image_mobile: 'image_mobile2'
    };

    const stateWithIngredients = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients: [ingredient1, ingredient2]
      }
    };

    const state = burgerConstructorSlice.reducer(
      stateWithIngredients,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.constructorItems.ingredients).toEqual([
      ingredient2,
      ingredient1
    ]);
  });
});
