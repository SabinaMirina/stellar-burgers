import { expect, test, describe } from '@jest/globals';
import { rootReducer } from './store';
import { allordersSlice } from '../slices/allOrdersSlice';
import { ordersSlice } from '../slices/orderSlice';
import { userRegisterSlice } from '../slices/registerSlice';
import { userAuthSlice } from '../slices/userAuthSlice';
import { ingredientsSlice } from '../slices/ingredientsSlice';
import { ingredientInfoSlice } from '../slices/ingredienInfotSlice';
import { burgerConstructorSlice } from '../slices/constructorSlice';

describe('rootReducer', () => {
  test('должен корректно инициализировать начальное состояние', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({
      allorders: allordersSlice.getInitialState(),
      orders: ordersSlice.getInitialState(),
      userRegister: userRegisterSlice.getInitialState(),
      userAuth: userAuthSlice.getInitialState(),
      ingredients: ingredientsSlice.getInitialState(),
      ingredientInfo: ingredientInfoSlice.getInitialState(),
      burgerConstructor: burgerConstructorSlice.getInitialState()
    });
  });
});
